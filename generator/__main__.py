import os
import shutil
import sys

import jinja2

from . import data


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
    raw_data = data.load(source_directory)

    music_weeks = sorted(
        (
            NS(slug=slug, **music_week)
            for (slug, music_week) in raw_data["music_weeks"].items()
        ),
        key=lambda w: w.slug,
    )

    sections = [
        NS(**section)
        for section in raw_data["sections"]
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


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
