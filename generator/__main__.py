import datetime
import itertools
import os
import shutil
import sys

import jinja2

from . import data as data_


class NS(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__.update(kwargs)


environment = jinja2.Environment(loader=jinja2.FileSystemLoader("templates"))


def render(*, template, destination, **context):
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "w") as f:
        f.write(environment.get_template(template).render(context))
        f.write("\n")


def main(source_directory, destination_directory):
    data = data_.load(source_directory)

    music_weeks = make_music_weeks(data.short_events)

    sections = [
        NS(slug="musique", title="Musique"),
        NS(slug="cinema", title="Cinéma"),
        NS(slug="theatre", title="Théâtre"),
        NS(slug="expositions", title="Expositions"),
    ]

    shutil.rmtree(destination_directory)
    shutil.copytree(os.path.join(source_directory, "skeleton"), destination_directory)

    render(
        template="index.html",
        destination=os.path.join(destination_directory, "index.html"),
        sections=sections,
    )

    render(
        template="ads.html",
        destination=os.path.join(destination_directory, "ads", "index.html"),
    )

    render(
        template="style.css",
        destination=os.path.join(destination_directory, "style.css"),
        colors=NS(
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
        ),
    )

    for section in sections:
        context = NS()
        template = "section.html"
        if section.slug == "musique":
            context = NS(music_weeks=music_weeks)
            template = "musique.html"
        render(
            template=template,
            destination=os.path.join(destination_directory, section.slug, "index.html"),
            title=section.title,
            section=section,
            sections=sections,
            **context,
        )

    for music_week in music_weeks:
        render(
            template="music_week.html",
            destination=os.path.join(destination_directory, "musique", music_week.slug, "index.html"),
            title=music_week.slug.replace("-", " "),
            section=sections[0],
            sections=sections,
            **music_week,
        )


# https://stackoverflow.com/a/38283685/905845
def iso_to_gregorian(iso_year, iso_week, iso_day):
    jan4 = datetime.date(iso_year, 1, 4)
    start = jan4 - datetime.timedelta(days=jan4.isoweekday()-1)
    return start + datetime.timedelta(weeks=iso_week-1, days=iso_day-1)


def make_music_weeks(events):
    music_weeks = []

    for ((year, week), week_events) in itertools.groupby(
        sorted(
            (e for e in events if "musique" in e.tags),
            key=lambda e: e.datetime
        ),
        key=lambda e: e.datetime.isocalendar()[:2],
    ):
        slug = "{}-{}".format(year, week)
        start_date = iso_to_gregorian(year, week, 1)
        days = []
        for (day, day_events) in itertools.groupby(week_events, key=lambda e: e.datetime.isoweekday()):
            date = iso_to_gregorian(year, week, day).strftime("%Y/%m/%d")
            concerts = []
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
                concerts.append(NS(time=time, location=location, artist=artist, genre=genre))
            days.append(NS(date=date, concerts=concerts))
        music_weeks.append(dict(slug=slug, start_date=start_date.strftime("%Y/%m/%d"), days=days))

    for i in range(0, len(music_weeks) - 1):
        music_weeks[i]["next_week"] = music_weeks[i + 1]["slug"]
    for i in range(1, len(music_weeks)):
        music_weeks[i]["previous_week"] = music_weeks[i - 1]["slug"]

    return [NS(**w) for w in music_weeks]


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
