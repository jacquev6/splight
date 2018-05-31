import datetime
import itertools
import os
import shutil

import jinja2

from . import dateutils
from . import data as data_


class NS(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__.update(kwargs)


class Generator:
    def __init__(self, source_directory, destination_directory):
        self.source_directory = source_directory
        self.destination_directory = destination_directory
        self.environment = jinja2.Environment(
            loader=jinja2.FileSystemLoader(os.path.join(source_directory, "templates")),
            trim_blocks=True,
            lstrip_blocks=True,
        )

    def render(self, *, template, destination, **context):
        os.makedirs(os.path.dirname(destination), exist_ok=True)
        with open(destination, "w") as f:
            f.write(self.environment.get_template(template).render(context))
            f.write("\n")

    def run(self):
        data = data_.load(self.source_directory)

        sections = [
            NS(slug="musique", title="Musique", event_type="Concerts"),
            NS(slug="cinema", title="Cinéma", event_type="Scéances"),
            NS(slug="theatre", title="Théâtre", event_type="Représentations"),
            NS(slug="expositions", title="Expositions", event_type="Expositions"),
        ]

        shutil.rmtree(self.destination_directory)
        shutil.copytree(os.path.join(self.source_directory, "skeleton"), self.destination_directory)

        self.render(
            template="ads.html",
            destination=os.path.join(self.destination_directory, "ads", "index.html"),
            sections=sections,
            root_path="",
        )

        for (root_path, weeks_count) in [("", 5), ("/admin", 5)]:
            previous_monday = dateutils.previous_week_day(datetime.date.today(), 0)
            week_start_dates = [previous_monday + datetime.timedelta(weeks=i) for i in range(weeks_count)]

            self.render(
                template="index.html",
                destination=os.path.join(self.destination_directory + root_path, "index.html"),
                cities=data.cities,
                root_path=root_path,
            )

            self.render(
                template="style.css",
                destination=os.path.join(self.destination_directory + root_path, "style.css"),
                colors=NS(
                    primary_very_light="#F99" if root_path else "#9AB2E8",
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
                root_path="",
            )

            for city in data.cities:
                self.render(
                    template="city.html",
                    destination=os.path.join(self.destination_directory + root_path, city.slug, "index.html"),
                    city=city,
                    sections=sections,
                    root_path=root_path,
                )

                for section in sections:
                    weeks = self.make_section_weeks(week_start_dates, section, city.events_by_date)

                    self.render(
                        template="section.html",
                        destination=os.path.join(
                            self.destination_directory + root_path, city.slug, section.slug, "index.html"
                        ),
                        city=city,
                        section=section,
                        sections=sections,
                        weeks=weeks,
                        root_path=root_path,
                    )

                    for week in weeks:
                        self.render(
                            template="week.html",
                            destination=os.path.join(
                                self.destination_directory + root_path, city.slug, section.slug, week.slug, "index.html"
                            ),
                            city=city,
                            section=section,
                            sections=sections,
                            week=week,
                            root_path=root_path,
                        )

    def make_section_weeks(self, week_start_dates, section, events_by_date):
        weeks = []
        for week_start_date in week_start_dates:
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
                        events.append(NS(time=time, location=location, artist=artist, genre=genre))
                if events:
                    days.append(NS(date=date.strftime("%Y/%m/%d"), events=events))

            weeks.append(dict(slug=slug, start_date=week_start_date.strftime("%Y/%m/%d"), days=days))

        for i in range(0, len(weeks) - 1):
            weeks[i]["next_week"] = weeks[i + 1]["slug"]
        for i in range(1, len(weeks)):
            weeks[i]["previous_week"] = weeks[i - 1]["slug"]

        return [NS(**w) for w in weeks]


def generate(**kwargs):
    Generator(**kwargs).run()
