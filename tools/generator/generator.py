import base64
import colorsys
import datetime
import hashlib
import itertools
import json
import os
import shutil
import subprocess
import types

from . import dateutils
from . import data as data_
from . import templates


def link_tree(src, dst):
    os.makedirs(dst)
    for name in os.listdir(src):
        srcname = os.path.join(src, name)
        dstname = os.path.join(dst, name)
        if os.path.isdir(srcname):
            link_tree(srcname, dstname)
        else:
            os.link(srcname, dstname)


def generate(*, data_directory, destination_directory):
    shutil.rmtree(destination_directory)
    # link_tree instead of shutil.copytree to be able to edit skeleton files without needing to regenerate the site
    link_tree(os.path.join(os.path.dirname(__file__), "skeleton"), destination_directory)

    data = data_.load(data_directory)

    cities = list(make_cities(data))

    with open(os.path.join(os.path.dirname(__file__), "modernizr-config.json")) as f:
        modernizr_features = [
            {
                "test/es6/collections": "es6collections",
            }.get(feature, feature.split("/")[-1])
            for feature in json.load(f)["feature-detects"]
        ]

    colors = templates.Colors(
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
    )

    encrypt_key = os.environ["SPLIGHT_ENCRYPT_KEY"]
    decrypt_key_sha = hashlib.sha1(encrypt_key.encode("utf-8")).hexdigest()

    templates.IndexHtml(decrypt_key_sha=decrypt_key_sha, cities=[city.for_templates for city in cities]).render()
    templates.AdsHtml(decrypt_key_sha=decrypt_key_sha).render()
    templates.StyleCss(modernizr_features=modernizr_features, colors=colors).render()

    for city in cities:
        date = city.first_day
        date_after = (
            dateutils.previous_week_day(datetime.date.today(), 0)
            + datetime.timedelta(weeks=10)
        )
        encrypt_after = (
            dateutils.previous_week_day(datetime.date.today(), 0)
            + datetime.timedelta(weeks=5)
        )
        first_week = templates.Week(start_date=city.first_day)
        week_after = templates.Week(start_date=date_after)

        templates.CityIndexHtml(
            decrypt_key_sha=decrypt_key_sha,
            city=city.for_templates,
            first_week=first_week,
            week_after=week_after,
        ).render()

        while date < date_after:
            if date.weekday() == 0:
                displayed_week = templates.Week(start_date=date)
                templates.CityWeekHtml(
                    decrypt_key_sha=decrypt_key_sha,
                    city=city.for_templates,
                    displayed_week=displayed_week,
                    first_week=first_week,
                    week_after=week_after,
                ).render()

                def make_events(d):
                    events = city.events.get(d, [])
                    if d >= encrypt_after:
                        # openssl enc doesn't provide a strong encryption (its IV is not random),
                        # but we don't require a high level of security.
                        # We just want to require an admin password to view events not yet published.
                        # We're even encrypting with fixed salt to produce deterministic files to be stored in git.
                        events = dict(
                            encrypted=base64.b64encode(subprocess.run(
                                [
                                    "openssl", "enc",
                                    "-e",
                                    "-aes-256-cbc",
                                    "-S", "0123456789",
                                    "-k", encrypt_key,
                                ],
                                input=json.dumps(
                                    events, separators=(',', ':'), default=templates.Event.to_json
                                ).encode("utf-8"),
                                stdout=subprocess.PIPE,
                            ).stdout).decode("utf-8")
                        )
                    return events

                events = {
                    d.isoformat(): make_events(d)
                    for d in (date + datetime.timedelta(days=i) for i in range(7))
                }
                with open("docs/{}/{}.json".format(city.for_templates.slug, displayed_week.slug), "w") as f:
                    json.dump(events, f, sort_keys=True, indent=1, default=templates.Event.to_json)

            date += datetime.timedelta(days=1)


def make_cities(data):
    for city in data.cities:
        tags = {
            tag.slug: templates.Tag(
                slug=tag.slug,
                title=tag.title,
                border_color=make_color(h=i / len(city.tags), s=0.5, v=0.5),
                background_color=make_color(h=i / len(city.tags), s=0.3, v=0.9),
            )
            for (i, tag) in enumerate(city.tags)
        }

        events = dict()
        for (day, day_events) in itertools.groupby(city.events, key=lambda e: e.datetime.date()):
            events[day] = []
            for event in day_events:
                if event.title:
                    title = event.title
                elif event.artist:
                    title = "{} ({})".format(event.artist.name, event.artist.genre)
                else:
                    assert False, "Event without title information"

                first_tag = tags[event.tags[0].slug]
                events[day].append(templates.Event(
                    title=title,
                    start=event.datetime,
                    end=event.datetime + event.duration if event.duration else None,
                    tags=[tag.slug for tag in event.tags],
                    border_color=first_tag.border_color,
                    background_color=first_tag.background_color,
                ))

        yield types.SimpleNamespace(
            for_templates=templates.City(
                slug=city.slug,
                name=city.name,
                tags=[tags[tag.slug] for tag in city.tags],
            ),
            first_day=dateutils.previous_week_day(city.events[0].datetime.date(), 0),
            events=events,
        )


def make_color(*, h, s, v):
    return "#{}".format("".join("{:02x}".format(int(0xFF * x)) for x in colorsys.hsv_to_rgb(h, s, v)))
