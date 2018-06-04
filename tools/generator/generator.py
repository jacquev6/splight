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
        # @todo Get these from data
        sections = [
            NS(slug="musique", title="Musique", event_type="Concerts"),
            NS(slug="cinema", title="Cinéma", event_type="Scéances"),
            NS(slug="theatre", title="Théâtre", event_type="Représentations"),
            NS(slug="expositions", title="Expositions", event_type="Expositions"),
        ]

        super().__init__(
            parent=None,
            slug=destination_directory,
            add_to_context=dict(
                sections=sections,
                cities=data.cities,
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
        super().__init__(parent=parent, slug="ads", add_to_context=dict())

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
        super().__init__(
            parent=parent,
            slug=city.slug,
            add_to_context=dict(
                city=city,
                events=city.events,
            ),
        )
        self.__weeks_count = weeks_count

    def run(self):
        self.render(template="city.html")

        for section in self.context.sections:
            OldSectionGenerator(parent=self, section=section, weeks_count=self.__weeks_count).run()


class OldSectionGenerator(Generator):
    def __init__(self, *, parent, section, weeks_count):
        city = parent.context.city
        generation_date = parent.context.generation.date
        oldest_day = min(city.events[0].datetime.date(), generation_date)
        first_week_start_date = dateutils.previous_week_day(oldest_day, 0)
        last_week_start_date = parent.context.generation.week.start_date + datetime.timedelta(weeks=weeks_count - 1)
        weeks = self.__make_section_weeks(
            first_week_start_date,
            last_week_start_date,
            section,
            parent.context.events,
        )

        super().__init__(
            parent=parent,
            slug=section.slug,
            add_to_context=dict(
                section=section,
                weeks=weeks,
            ),
        )

    def run(self):
        self.render(template="city/section.html")

        for week in self.context.weeks:
            OldWeekGenerator(parent=self, week=week).run()

    @staticmethod
    def __make_section_weeks(
        first_week_start_date,
        last_week_start_date,
        section,
        events,
    ):
        events_by_date = {}
        for (day, day_events) in itertools.groupby(events, key=lambda e: e.datetime.date()):
            events_by_date[day] = list(day_events)
        weeks = []
        for week_index in range(1 + (last_week_start_date - first_week_start_date).days // 7):
            week_start_date = first_week_start_date + datetime.timedelta(weeks=week_index)
            days = []
            for i in range(7):
                date = week_start_date + datetime.timedelta(days=i)

                events = []
                for event in events_by_date.get(date, []):
                    if section.slug in event.tags:
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
                        ))
                days.append(NS(date=date, events=events))

            weeks.append(dict(
                start_date=week_start_date,
                days=days,
            ))

        for i in range(0, len(weeks) - 1):
            weeks[i]["next_week"] = weeks[i + 1]
        for i in range(1, len(weeks)):
            weeks[i]["previous_week"] = weeks[i - 1]

        return [NS(**w) for w in weeks]


def format_datetime(dt, format=None):
    if format is None:
        if isinstance(dt, datetime.date):
            format = "%Y/%m/%d"
        elif isinstance(dt, datetime.time):
            if dt.minute:
                format = "%Hh%M"
            else:
                format = "%Hh"
        else:
            assert False, ("Not a datetime:", dt)
    return dt.strftime(format)


class OldWeekGenerator(Generator):
    def __init__(self, *, parent, week):
        super().__init__(
            parent=parent,
            slug=format_datetime(week.start_date, "%Y-%W"),
            add_to_context=dict(
                week=week,
            ),
        )

    def run(self):
        self.render(template="city/section/week.html")


def generate(*, data_directory, destination_directory):
    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(os.path.dirname(__file__), "skeleton"), destination_directory)

    environment = jinja2.Environment(
        loader=jinja2.FileSystemLoader(os.path.join(os.path.dirname(__file__), "templates")),
        trim_blocks=True,
        lstrip_blocks=True,
    )
    environment.filters["dt"] = format_datetime

    RootGenerator(
        destination_directory=destination_directory,
        data=data.load(data_directory),
        environment=environment,
    ).run()
