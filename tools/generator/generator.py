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
    def __init__(self, *, parent):
        self.__parent = parent

    def render(self, *, template, destination):
        destination = self.__full_destination(destination)
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        with open(destination, "w") as f:
            f.write(self.__root_environment().get_template(template).render(self.__full_context()))
            f.write("\n")

    def __lineage(self):
        return list(reversed(list(self.__ancestors())))

    def __ancestors(self):
        parent = self
        while parent:
            yield parent
            parent = parent.__parent

    def __full_context(self):
        ctx = dict()
        for g in self.__lineage():
            ctx.update(g.context)
        return ctx

    def __full_destination(self, destination):
        if isinstance(destination, str):
            destination = (destination,)
        return os.path.join(*(g.slug for g in self.__lineage()), *destination)

    def __root_environment(self):
        return self.__lineage()[0].environment


class RootGenerator(Generator):
    def __init__(self, *, destination_directory, data, environment):
        super().__init__(parent=None)
        self.__data = data
        self.__sections = [
            NS(slug="musique", title="Musique", event_type="Concerts"),
            NS(slug="cinema", title="Cinéma", event_type="Scéances"),
            NS(slug="theatre", title="Théâtre", event_type="Représentations"),
            NS(slug="expositions", title="Expositions", event_type="Expositions"),
        ]

        today = datetime.date.today() - datetime.timedelta(weeks=1)  # @todo Remove delay

        self.slug = destination_directory
        self.environment = environment
        self.context = dict(
            sections=self.__sections,
            cities=self.__data.cities,
            current_week=NS(slug=dateutils.previous_week_day(today, 0).strftime("%Y-%W")),
        )

    def run(self):
        self.render(template="ads.html", destination=("ads", "index.html"))

        for (version, weeks_count) in [("", 5), ("admin", 10)]:
            VersionGenerator(
                parent=self,
                data=self.__data,
                sections=self.__sections,
                version=version,
                weeks_count=weeks_count,
            ).run()


class VersionGenerator(Generator):
    def __init__(self, *, parent, data, sections, version, weeks_count):
        super().__init__(parent=parent)
        self.__weeks_count = weeks_count
        self.__data = data
        self.__sections = sections

        self.slug = version
        self.context = dict(
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
        )

    def run(self):
        self.render(template="index.html", destination="index.html")
        self.render(template="style.css", destination="style.css")

        for city in self.__data.cities:
            CityGenerator(parent=self, city=city, sections=self.__sections, weeks_count=self.__weeks_count).run()


class CityGenerator(Generator):
    def __init__(self, *, parent, city, sections, weeks_count):
        super().__init__(parent=parent)
        self.__sections = sections
        self.__city = city
        self.__weeks_count = weeks_count

        self.slug = city.slug
        self.context = dict(
            city=city,
        )

    def run(self):
        self.render(template="city.html", destination="index.html")

        for section in self.__sections:
            SectionGenerator(parent=self, city=self.__city, section=section, weeks_count=self.__weeks_count).run()


class SectionGenerator(Generator):
    def __init__(self, *, parent, city, section, weeks_count):
        super().__init__(parent=parent)

        today = datetime.date.today() - datetime.timedelta(weeks=1)  # @todo Remove delay
        oldest_day = min(city.events[0].datetime.date(), today)
        first_week_start_date = dateutils.previous_week_day(oldest_day, 0)
        current_week_start_date = dateutils.previous_week_day(today, 0)
        last_week_start_date = current_week_start_date + datetime.timedelta(weeks=weeks_count - 1)

        self.__weeks = self.__make_section_weeks(
            first_week_start_date,
            current_week_start_date,
            last_week_start_date,
            section,
            city.events,
        )

        self.slug = section.slug
        self.context = dict(
            section=section,
            weeks=self.__weeks,
        )

    def run(self):
        self.render(template="city/section.html", destination="index.html")

        for week in self.__weeks:
            WeekGenerator(parent=self, week=week).run()

    def __make_section_weeks(
        self,
        first_week_start_date,
        current_week_start_date,
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
            slug = week_start_date.strftime("%Y-%W")
            days = []
            for i in range(7):
                date = week_start_date + datetime.timedelta(days=i)

                events = []
                for event in events_by_date.get(date, []):
                    if section.slug in event.tags:
                        time = event.datetime.time()
                        if time.minute:
                            time = time.strftime("%Hh%M")
                        else:
                            time = time.strftime("%Hh")
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
                days.append(NS(date=date.strftime("%Y/%m/%d"), events=events))

            weeks.append(dict(
                slug=slug,
                # @todo Format all datetimes in templates, using custom filters
                start_date=week_start_date.strftime("%Y/%m/%d"),
                iso_start_date=week_start_date.strftime("%Y-%m-%d"),
                days=days,
            ))

        for i in range(0, len(weeks) - 1):
            weeks[i]["next_week"] = weeks[i + 1]["slug"]
        for i in range(1, len(weeks)):
            weeks[i]["previous_week"] = weeks[i - 1]["slug"]

        return [NS(**w) for w in weeks]


class WeekGenerator(Generator):
    def __init__(self, *, parent, week):
        super().__init__(parent=parent)
        self.__week = week

        self.slug = self.__week.slug
        self.context = dict(
            week=week,
        )

    def run(self):
        self.render(template="city/section/week.html", destination="index.html")


def generate(*, source_directory, destination_directory):
    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(source_directory, "skeleton"), destination_directory)

    RootGenerator(
        destination_directory=destination_directory,
        data=data.load(source_directory),
        environment=jinja2.Environment(
            loader=jinja2.FileSystemLoader(os.path.join(source_directory, "templates")),
            trim_blocks=True,
            lstrip_blocks=True,
        ),
    ).run()
