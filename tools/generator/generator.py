import calendar
import colorsys
import datetime
import itertools
import json
import os
import shutil

import jinja2

from . import dateutils
from . import data as data_
from . import templates


# BEGIN OF SECTION TO BE REMOVED
class NS(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__.update(kwargs)


class Generator:
    def __init__(self, *, parent, slug, add_to_context):
        self.__parent = parent
        self.__destination = os.path.join(parent.__destination, slug) if parent else slug
        context = dict(parent.context) if parent else dict()
        context.update(add_to_context)
        self.context = NS(**context)

    def render(self, *, template, destination="index.html"):
        destination = os.path.join(self.__destination, destination)
        # print("Rendering", destination, "with", self.context.keys())
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        with open(destination, "w") as f:
            f.write(self.__root_environment().get_template(template).render(self.context))
            f.write("\n")

    def __root_environment(self):
        if self.__parent:
            return self.__parent.__root_environment()
        else:
            return self.environment


class RootGenerator(Generator):
    def __init__(self, *, destination_directory, data, environment, generation):
        self.__generation = generation
        super().__init__(
            parent=None,
            slug=destination_directory,
            add_to_context=dict(
                cities=data.cities,
                # @todo Remove generation date from context:
                # generate site independently from generation date, and fix it with JavaScript
                generation=self.__generation,
            ),
        )
        self.__data = data

        self.environment = environment

    def run(self):
        for city in self.context.cities:
            CityGenerator(parent=self, city=city, weeks_count=5).run()


class CityGenerator(Generator):
    def __init__(self, *, parent, city, weeks_count):
        self.__tags = {
            tag.slug: NS(
                slug=tag.slug,
                title=tag.title,
                border_color=make_color(h=i / len(city.tags), s=0.5, v=0.5),
                background_color=make_color(h=i / len(city.tags), s=0.3, v=0.9),
            )
            for (i, tag) in enumerate(city.tags)
        }

        events = dict()
        for (day, day_events) in itertools.groupby(city.events, key=lambda e: e.datetime.date()):
            events[day] = []
            for event in day_events:
                location = ""
                if event.location:
                    location = event.location.name

                if event.title:
                    title = event.title
                elif event.artist:
                    title = "{} ({})".format(event.artist.name, event.artist.genre)
                else:
                    assert False, "Event without title information"

                kwds = dict()

                if event.duration:
                    kwds["end"] = event.datetime + event.duration

                events[day].append(NS(
                    title=title,
                    location=location,
                    start=event.datetime,
                    tags=[self.__tags[tag.slug] for tag in event.tags],
                    **kwds,
                ))

        super().__init__(
            parent=parent,
            slug=city.slug,
            add_to_context=dict(
                city=city,
                tags=[self.__tags[tag.slug] for tag in city.tags],
                events=events,
            ),
        )
        self.__weeks_count = weeks_count

    def run(self):
        for week in self.__make_old_weeks(self.context.city.events):
            OldWeekGenerator(parent=self, week=week).run()

    def __make_old_weeks(self, events):
        weeks = [self.__make_old_week(start_date) for start_date in self.__generate_old_start_dates(events)]

        for i in range(1, len(weeks)):
            # previous and next_week are dict instead of NS. This is fine for now.
            weeks[i]["previous_week"] = weeks[i - 1]
            weeks[i - 1]["next_week"] = weeks[i]

        return [NS(**week) for week in weeks]

    def __make_old_week(self, start_date):
        return dict(
            slug=start_date.strftime("%Y-%W"),
            previous_week=None,
            next_week=None,
            days=[start_date + datetime.timedelta(days=i) for i in range(7)],
            day_after=start_date + datetime.timedelta(days=7),
        )

    def __generate_old_start_dates(self, events):
        start_date = dateutils.previous_week_day(events[0].datetime.date(), 0)
        last_day = (
            dateutils.previous_week_day(self.context.generation.date, 0)
            + datetime.timedelta(weeks=self.__weeks_count)
        )
        while start_date < last_day:
            yield start_date
            start_date += datetime.timedelta(days=7)


class OldWeekGenerator(Generator):
    def __init__(self, *, parent, week):
        super().__init__(parent=parent, slug=week.slug, add_to_context=dict(week=week))

    def run(self):
        self.render(template="old_week.html")


def generate_old_weeks(destination_directory, data, generation):
    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
        trim_blocks=True,
        lstrip_blocks=True,
        undefined=jinja2.StrictUndefined,
    )
    environment.filters["format_date"] = format_date
    RootGenerator(
        destination_directory=destination_directory,
        data=data,
        environment=environment,
        generation=generation,
    ).run()
# END OF SECTION TO BE REMOVED


def format_date(d):
    months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ]
    days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    return d.strftime("{} %d {} %Y".format(days[d.weekday()], months[d.month - 1]))


def link_tree(src, dst):
    os.makedirs(dst)
    for name in os.listdir(src):
        srcname = os.path.join(src, name)
        dstname = os.path.join(dst, name)
        if os.path.isdir(srcname):
            link_tree(srcname, dstname)
        else:
            os.link(srcname, dstname)


def generate(*, data_directory, destination_directory):
    shutil.rmtree(destination_directory)
    # link_tree instead of shutil.copytree to be able to edit skeleton files without needing to regenerate the site
    link_tree(os.path.join(os.path.dirname(__file__), "skeleton"), destination_directory)

    today = datetime.date.today()
    generation = NS(date=today, week=NS(slug=today.strftime("%Y-%W")))
    data = data_.load(data_directory)

    generate_old_weeks(destination_directory, data, generation)

    cities = list(make_template_cities(data))

    with open(os.path.join(os.path.dirname(__file__), "modernizr-config.json")) as f:
        modernizr_features = [
            {
                "test/es6/collections": "es6collections",
            }.get(feature, feature.split("/")[-1])
            for feature in json.load(f)["feature-detects"]
        ]

    colors = templates.Colors(
        primary_very_light="#9AB2E8",
        primary_light="#5E81D2",
        primary="#3660C1",
        primary_dark="#103FAC",
        primary_very_dark="#0A2B77",
        complement_very_light="#FFDF9F",
        complement_light="#FFCB62",
        complement="#FFBA31",
        complement_dark="#FFAA00",
        complement_very_dark="#B17600",
    )

    templates.IndexHtml(cities=[city for (city, first_day) in cities]).render()
    templates.AdsHtml().render()
    templates.StyleCss(modernizr_features=modernizr_features, colors=colors).render()

    for (city, first_day) in cities:
        templates.CityHtml(city=city, generation=generation).render()

        date = first_day
        date_after = (
            dateutils.previous_week_day(generation.date, 0)
            + datetime.timedelta(weeks=10)
        )

        while date < date_after:
            if date.weekday() == 0:
                week = templates.Week(start_date=date)
                templates.WeekHtml(city=city, week=week).render()
            date += datetime.timedelta(days=1)


def make_template_cities(data):
    for city in data.cities:
        tags = {
            tag.slug: templates.Tag(
                slug=tag.slug,
                title=tag.title,
                border_color=make_color(h=i / len(city.tags), s=0.5, v=0.5),
                background_color=make_color(h=i / len(city.tags), s=0.3, v=0.9),
            )
            for (i, tag) in enumerate(city.tags)
        }

        yield (
            templates.City(
                slug=city.slug,
                name=city.name,
                tags=[tags[tag.slug] for tag in city.tags],
            ),
            dateutils.previous_week_day(city.events[0].datetime.date(), 0),
        )


def make_color(*, h, s, v):
    return "#{}".format("".join("{:02x}".format(int(0xFF * x)) for x in colorsys.hsv_to_rgb(h, s, v)))
