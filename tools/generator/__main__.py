import datetime
import itertools
import os
import shutil
import sys

import jinja2

from . import dateutils
from . import data as data_


class NS(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__.update(kwargs)


environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader("templates"),
    trim_blocks=True,
    lstrip_blocks=True,
)


def render(*, template, destination, **context):
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "w") as f:
        f.write(environment.get_template(template).render(context))
        f.write("\n")


def main(source_directory, destination_directory):
    data = data_.load(source_directory)

    sections = [
        NS(slug="musique", title="Musique", event_type="Concerts"),
        NS(slug="cinema", title="Cinéma", event_type="Scéances"),
        NS(slug="theatre", title="Théâtre", event_type="Représentations"),
        NS(slug="expositions", title="Expositions", event_type="Expositions"),
    ]

    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(source_directory, "skeleton"), destination_directory)

    render(
        template="ads.html",
        destination=os.path.join(destination_directory, "ads", "index.html"),
        sections=sections,
        root_path="",
    )

    for root_path in ["", "/admin"]:
        render(
            template="index.html",
            destination=os.path.join(destination_directory + root_path, "index.html"),
            cities=data.cities,
            root_path=root_path,
        )

        render(
            template="style.css",
            destination=os.path.join(destination_directory + root_path, "style.css"),
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
            render(
                template="city.html",
                destination=os.path.join(destination_directory + root_path, city.slug, "index.html"),
                city=city,
                sections=sections,
                root_path=root_path,
            )

            for section in sections:
                weeks = make_section_weeks(section, city.events)

                render(
                    template="section.html",
                    destination=os.path.join(destination_directory + root_path, city.slug, section.slug, "index.html"),
                    city=city,
                    section=section,
                    sections=sections,
                    weeks=weeks,
                    root_path=root_path,
                )

                for week in weeks:
                    render(
                        template="week.html",
                        destination=os.path.join(
                            destination_directory + root_path, city.slug, section.slug, week.slug, "index.html"
                        ),
                        city=city,
                        section=section,
                        sections=sections,
                        week=week,
                        root_path=root_path,
                    )


def make_section_weeks(section, events):
    weeks = []

    for ((year, week), week_events) in itertools.groupby(
        sorted(
            (e for e in events if section.slug in e.tags),
            key=lambda e: e.datetime
        ),
        key=lambda e: e.datetime.isocalendar()[:2],
    ):
        slug = "{}-{}".format(year, week)
        start_date = dateutils.iso_to_gregorian(year, week, 1)
        days = []
        for (day, day_events) in itertools.groupby(week_events, key=lambda e: e.datetime.isoweekday()):
            date = dateutils.iso_to_gregorian(year, week, day).strftime("%Y/%m/%d")
            events = []
            for event in day_events:
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
            days.append(NS(date=date, events=events))
        weeks.append(dict(slug=slug, start_date=start_date.strftime("%Y/%m/%d"), days=days))

    for i in range(0, len(weeks) - 1):
        weeks[i]["next_week"] = weeks[i + 1]["slug"]
    for i in range(1, len(weeks)):
        weeks[i]["previous_week"] = weeks[i - 1]["slug"]

    return [NS(**w) for w in weeks]


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
