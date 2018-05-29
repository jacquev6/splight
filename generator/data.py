import datetime as datetime_
import itertools
import os

from . import multi_yaml


def _yield_source(name, fields):
    fields = fields.split(" ")
    yield "class {}(tuple):".format(name)
    yield "    def __new__(cls, *, {}):".format(", ".join(fields))
    yield "        return tuple.__new__(cls, ({},))".format(", ".join(fields))
    for (i, field) in enumerate(fields):
        yield "    @property"
        yield "    def {}(self):".format(field)
        yield "        return self[{}]".format(i)
    yield "    def __repr__(self):"
    yield "        return '{}({})'.format({})".format(
        name,
        ", ".join("{}={{}}".format(field) for field in fields),
        ", ".join("repr(self.{})".format(field) for field in fields),
    )


def _make_source(name, fields):
    return "\n".join(_yield_source(name, fields))


def _make_base(name, fields):
    namespace = dict()
    exec(_make_source(name, fields), namespace)
    return namespace[name]


exec(_make_source("Data", "events"))

exec(_make_source("Artist", "slug name genre"))
exec(_make_source("Location", "slug name"))
exec(_make_source("Event", "datetime artist location tags"))


def load(source_directory):
    return make_data(**multi_yaml.load(os.path.join(source_directory, "data")))


def make_data(*, artists, locations, events):
    artists = {slug: Artist(slug=slug, **artist) for (slug, artist) in artists.items()}
    locations = {slug: Location(slug=slug, **location) for (slug, location) in locations.items()}
    events = list(generate_events(artists, locations, events))
    return Data(events=events)


def generate_events(artists, locations, events):
    for (tag, tagged_events) in events.items():
        for event in tagged_events:
            yield from generate_tagged_events(artists, locations, tag, **event)


def generate_tagged_events(
    artists, locations, main_tag,
    *,
    datetime=None, artist=None, location=None, tags=[], occurrences=None,
):
    artist = artists.get(artist)
    location = locations.get(location)

    if isinstance(tags, str):
        tags = [tags]
    tags = set(tags)
    tags.add(main_tag)

    if occurrences:
        datetimes = [o["datetime"] for o in occurrences]
    else:
        assert datetime is not None
        datetimes = [datetime]

    for datetime in datetimes:
        datetime = datetime_.datetime.strptime(datetime, "%Y/%m/%d %H:%M")
        yield Event(datetime=datetime, artist=artist, location=location, tags=tags)
