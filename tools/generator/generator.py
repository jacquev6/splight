import calendar
import colorsys
import datetime
import itertools
import os
import shutil

import jinja2

from . import dateutils
from . import data


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
    def __init__(self, *, destination_directory, data, environment):
        today = datetime.date.today()
        super().__init__(
            parent=None,
            slug=destination_directory,
            add_to_context=dict(
                cities=data.cities,
                # @todo Remove generation date from context:
                # generate site independently from generation date, and fix it with JavaScript
                generation=NS(date=today, week=NS(slug=today.strftime("%Y-%W"))),
            ),
        )

        self.environment = environment

    def run(self):
        AdsGenerator(parent=self).run()

        for (version, weeks_count) in [("", 5), ("admin", 10)]:
            VersionGenerator(
                parent=self,
                version=version,
                weeks_count=weeks_count,
            ).run()


class AdsGenerator(Generator):
    def __init__(self, *, parent):
        super().__init__(parent=parent, slug="ads", add_to_context=dict(root_path=""))

    def run(self):
        self.render(template="ads.html")


class VersionGenerator(Generator):
    def __init__(self, *, parent, version, weeks_count):
        super().__init__(
            parent=parent,
            slug=version,
            add_to_context=dict(
                root_path="/{}".format(version) if version else "",
                colors=NS(
                    primary_very_light="#F99" if version else "#9AB2E8",
                    primary_light="#5E81D2",
                    primary="#3660C1",
                    primary_dark="#103FAC",
                    primary_very_dark="#0A2B77",
                    complement_very_light="#FFDF9F",
                    complement_light="#FFCB62",
                    complement="#FFBA31",
                    complement_dark="#FFAA00",
                    complement_very_dark="#B17600",
                ),
            ),
        )
        self.__weeks_count = weeks_count

    def run(self):
        self.render(template="index.html")
        self.render(template="style.css", destination="style.css")

        for city in self.context.cities:
            CityGenerator(parent=self, city=city, weeks_count=self.__weeks_count).run()


class CityGenerator(Generator):
    def __init__(self, *, parent, city, weeks_count):
        tags = {
            tag.slug: NS(
                slug=tag.slug,
                title=tag.title,
                border_color=self.__make_color(h=i / len(city.tags), s=0.5, v=0.5),
                background_color=self.__make_color(h=i / len(city.tags), s=0.3, v=0.9),
            )
            for (i, tag) in enumerate(city.tags)
        }

        events = dict()
        for (day, day_events) in itertools.groupby(city.events, key=lambda e: e.datetime.date()):
            events[day] = []
            for event in day_events:
                time = event.datetime.time()
                location = ""
                if event.location:
                    location = event.location.name
                artist = ""
                if event.artist:
                    artist = event.artist.name
                genre = ""
                if event.artist:
                    genre = event.artist.genre
                events[day].append(NS(
                    datetime=event.datetime,
                    location=location,
                    artist=artist,
                    genre=genre,
                    tags=[tags[tag.slug] for tag in event.tags],
                ))

        super().__init__(
            parent=parent,
            slug=city.slug,
            add_to_context=dict(
                city=city,
                tags=[tags[tag.slug] for tag in city.tags],
                events=events,
            ),
        )
        self.__weeks_count = weeks_count

    @staticmethod
    def __make_color(*, h, s, v):
        return "#{}".format("".join("{:02x}".format(int(0xFF * x)) for x in colorsys.hsv_to_rgb(h, s, v)))

    def run(self):
        self.render(template="city.html")

        for week in self.__make_weeks(self.context.city.events):
            WeekGenerator(parent=self, week=week).run()

    def __make_weeks(self, events):
        weeks = [self.__make_week(start_date) for start_date in self.__generate_start_dates(events)]

        for i in range(1, len(weeks)):
            # previous and next_week are dict instead of NS. This is fine for now.
            weeks[i]["previous_week"] = weeks[i - 1]
            weeks[i - 1]["next_week"] = weeks[i]

        return [NS(**week) for week in weeks]

    def __make_week(self, start_date):
        return dict(
            slug=start_date.strftime("%Y-%W"),
            previous_week=None,
            next_week=None,
            days=[start_date + datetime.timedelta(days=i) for i in range(7)],
            day_after=start_date + datetime.timedelta(days=7),
        )

    def __generate_start_dates(self, events):
        start_date = dateutils.previous_week_day(events[0].datetime.date(), 0)
        last_day = (
            dateutils.previous_week_day(self.context.generation.date, 0)
            + datetime.timedelta(weeks=self.__weeks_count)
        )
        while start_date < last_day:
            yield start_date
            start_date += datetime.timedelta(days=7)


class WeekGenerator(Generator):
    def __init__(self, *, parent, week):
        super().__init__(parent=parent, slug=week.slug, add_to_context=dict(week=week))

    def run(self):
        self.render(template="week.html")


def format_date(d):
    months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ]
    days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    return d.strftime("{} %d {} %Y".format(days[d.weekday()], months[d.month - 1]))


def format_time(t):
    if t.minute:
        format = "%Hh%M"
    else:
        format = "%Hh"
    return t.strftime(format)


def generate(*, data_directory, destination_directory):
    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(os.path.dirname(__file__), "skeleton"), destination_directory)

    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
        trim_blocks=True,
        lstrip_blocks=True,
        undefined=jinja2.StrictUndefined,
    )
    environment.filters["format_date"] = format_date
    environment.filters["format_time"] = format_time

    RootGenerator(
        destination_directory=destination_directory,
        data=data.load(data_directory),
        environment=environment,
    ).run()
