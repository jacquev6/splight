#!/usr/bin/env python3

import glob
import os
import sys

import yaml
import jinja2


class NS(dict):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.__dict__.update(kwargs)

environment = jinja2.Environment(loader=jinja2.FileSystemLoader("templates"))

def render(*, template, destination, **context):
    destination = os.path.join(sys.argv[1], destination)
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "w") as f:
        f.write(environment.get_template(template).render(context))
        f.write("\n")

def load_yaml_file(file_name):
    with open(file_name) as f:
        return yaml.load(f)

music_weeks = [NS(slug=f[12:-4], **load_yaml_file(f)) for f in sorted(glob.glob("music_weeks/*.yml"))]

sections = [
    NS(slug="musique", title="Musique", template="musique.html", context=NS(music_weeks=music_weeks)),
    NS(slug="cinema", title="Cinéma", template="section.html", context=NS()),
    NS(slug="theatre", title="Théâtre", template="section.html", context=NS()),
    NS(slug="expositions", title="Expositions", template="section.html", context=NS()),
]

render(
    template="index.html",
    destination="index.html",
    sections=sections,
)

render(
    template="ads.html",
    destination="ads/index.html",
)

render(
    template="style.css",
    destination="style.css",
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
    render(
        template=section.template,
        destination="{}/index.html".format(section.slug),
        title=section.title,
        section=section,
        sections=sections,
        **section.context,
    )

for music_week in music_weeks:
    render(
        template="music_week.html",
        destination="musique/{}/index.html".format(music_week.slug),
        title=music_week.slug.replace("-", " "),
        section=sections[0],
        sections=sections,
        **music_week,
    )
