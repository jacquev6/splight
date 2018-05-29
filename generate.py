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
    NS(slug="musique", title="Musique"),
    NS(slug="cinema", title="Cinéma"),
    NS(slug="theatre", title="Théâtre"),
    NS(slug="expositions", title="Expositions"),
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

for music_week in music_weeks:
    render(
        template="music_week.html",
        destination="musique/{}/index.html".format(music_week.slug),
        title=music_week.slug.replace("-", " "),
        section=sections[0],
        sections=sections,
        **music_week,
    )
