import os
import datetime as datetime_

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


exec(_make_source("Data", "short_events"))

exec(_make_source("Artist", "slug name genre"))
exec(_make_source("Location", "slug name"))
exec(_make_source("ShortEvent", "datetime artist location tags"))


def load(source_directory):
    return make_data(**multi_yaml.load(os.path.join(source_directory, "data")))


def make_data(*, artists, locations, one_shots):
    artists = {slug: Artist(slug=slug, **artist) for (slug, artist) in artists.items()}
    locations = {slug: Location(slug=slug, **location) for (slug, location) in locations.items()}
    short_events = [make_event(artists, locations, **event) for event in one_shots]
    return Data(short_events=short_events)


def make_event(artists, locations, *, datetime, artist=None, location=None, tags=[]):
    artist = artists.get(artist)
    location = locations.get(location)
    datetime = datetime_.datetime.strptime(datetime, "%Y/%m/%d %H:%M")
    if isinstance(tags, str):
        tags = [tags]
    return ShortEvent(datetime=datetime, artist=artist, location=location, tags=tags)
