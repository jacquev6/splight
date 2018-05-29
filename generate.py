#!/usr/bin/env python3

import sys
import os

import jinja2

environment = jinja2.Environment(loader=jinja2.FileSystemLoader("templates"))

def render(*, template, destination, **context):
    destination = os.path.join(sys.argv[1], destination)
    os.makedirs(os.path.dirname(destination), exist_ok=True)
    with open(destination, "w") as f:
        f.write(environment.get_template(template).render(context))
        f.write("\n")

render(
    template="index.html",
    destination="index.html",
    sections=[
        dict(slug="musique", title="Musique"),
        dict(slug="cinema", title="Cinéma"),
        dict(slug="theatre", title="Théâtre"),
        dict(slug="expositions", title="Expositions"),
    ],
)

render(
    template="ads.html",
    destination="ads/index.html",
)
