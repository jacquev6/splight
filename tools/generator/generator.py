import calendar
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


def full_day_info(dt):
    assert isinstance(dt, datetime.date)
    return NS(
        date=dt,
        week=NS(
            start_date=dateutils.previous_week_day(dt, 0),
            slug="{0:04}-{1:02}".format(*dt.isocalendar()),
            year=dt.isocalendar()[0],
            index=dt.isocalendar()[1],
        ),
    )


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
        super().__init__(
            parent=None,
            slug=destination_directory,
            add_to_context=dict(
                cities=data.cities,
                # @todo Remove generation date from context:
                # generate site independently from generation date, and fix it with JavaScript
                generation=full_day_info(datetime.date.today()),
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
        first_day = min(city.events[0].datetime.date(), parent.context.generation.date)
        last_week_start_date = parent.context.generation.week.start_date + datetime.timedelta(weeks=weeks_count - 1)
        last_day = last_week_start_date + datetime.timedelta(days=6)

        super().__init__(
            parent=parent,
            slug=city.slug,
            add_to_context=dict(
                city=city,
                sections=city.tags,
                events=city.events,
                first_day=first_day,
                last_day=last_day,
            ),
        )

    def run(self):
        self.render(template="city.html")

        first_year = self.context.first_day.year
        last_year = self.context.last_day.year
        for year in range(first_year, last_year + 1):
            first_week = max(self.context.first_day, datetime.date(year, 1, 1)).isocalendar()[1]
            last_week = min(self.context.last_day, datetime.date(year, 12, 31)).isocalendar()[1]
            for week in range(first_week, last_week + 1):
                WeekGenerator(parent=self, year=year, week=week).run()


class WeekGenerator(Generator):
    def __init__(self, *, parent, year, week):
        start_date = dateutils.iso_to_gregorian(year, week, 1)
        previous_week = NS(slug="{0:04}-{1:02}".format(*(start_date - datetime.timedelta(days=7)).isocalendar()))
        if start_date - datetime.timedelta(days=7) < dateutils.previous_week_day(parent.context.first_day, 0):
            previous_week = None
        next_week = NS(slug="{0:04}-{1:02}".format(*(start_date + datetime.timedelta(days=7)).isocalendar()))
        if start_date + datetime.timedelta(days=7) > parent.context.last_day:
            next_week = None

        events_by_date = {}
        for (day, day_events) in itertools.groupby(parent.context.city.events, key=lambda e: e.datetime.date()):
            events_by_date[day] = list(day_events)

        days = []
        for i in range(7):
            date = start_date + datetime.timedelta(days=i)
            events = []
            for event in events_by_date.get(date, []):
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
                events.append(NS(
                    datetime=event.datetime,
                    time=time,
                    location=location,
                    artist=artist,
                    genre=genre,
                    tags=event.tags,
                ))
            days.append(NS(date=date, events=events))

        super().__init__(
            parent=parent,
            slug="{:04}-{:02}".format(year, week),
            add_to_context=dict(
                week=NS(start_date=start_date, previous_week=previous_week, next_week=next_week, days=days),
            ),
        )

    def run(self):
        self.render(template="week.html")


def format_datetime(dt):
    if isinstance(dt, datetime.date):
        format = "%Y/%m/%d"  # @todo Fix format to "15 janvier 2018"
    elif isinstance(dt, datetime.time):
        if dt.minute:
            format = "%Hh%M"
        else:
            format = "%Hh"
    else:
        assert False, ("Not a datetime:", dt)
    return dt.strftime(format)


def generate(*, data_directory, destination_directory):
    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(os.path.dirname(__file__), "skeleton"), destination_directory)

    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
        trim_blocks=True,
        lstrip_blocks=True,
        undefined=jinja2.StrictUndefined,
    )
    environment.filters["dt"] = format_datetime

    RootGenerator(
        destination_directory=destination_directory,
        data=data.load(data_directory),
        environment=environment,
    ).run()
