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


exec(_make_source("Data", "cities"))
exec(_make_source("City", "slug name tags events"))
exec(_make_source("Tag", "slug title display_order"))
exec(_make_source("Event", "datetime title artist location tags"))
exec(_make_source("Artist", "slug name genre"))
exec(_make_source("Location", "slug name"))


def load(data_directory):
    return make_data(**multi_yaml.load(data_directory))


def make_data(*, artists, cities):
    artists = {slug: Artist(slug=slug, **artist) for (slug, artist) in artists.items()}
    cities = [make_city(artists, slug=slug, **city) for (slug, city) in cities.items()]
    return Data(cities=cities)


def make_city(artists, *, slug, name, tags, locations, events):
    locations = {slug: Location(slug=slug, **location) for (slug, location) in locations.items()}
    tags = {slug: Tag(slug=slug, **tag) for (slug, tag) in tags.items()}
    events = sorted(generate_events(artists, locations, tags, events), key=lambda e: e.datetime)
    tags = sorted(tags.values(), key=lambda tag: tag.display_order)
    return City(slug=slug, name=name, tags=tags, events=events)


def generate_events(artists, locations, tags, events):
    for (tag, tagged_events) in events.items():
        for event in tagged_events:
            yield from generate_tagged_events(artists, locations, tag, tags, **event)


def generate_tagged_events(
    artists, locations, main_tag, tags_map,
    *,
    datetime=None, title=None, artist=None, location=None, tags=[], occurrences=None,
):
    artist = artists.get(artist)
    location = locations.get(location)

    if isinstance(tags, str):
        tags = [tags]
    tags = [tags_map[tag] for tag in sorted(set(tags))]
    tags.append(tags_map[main_tag])

    if occurrences:
        datetimes = [o["datetime"] for o in occurrences]
    else:
        assert datetime is not None
        datetimes = [datetime]

    for datetime in datetimes:
        datetime = datetime_.datetime.strptime(datetime, "%Y/%m/%d %H:%M")
        yield Event(datetime=datetime, title=title, artist=artist, location=location, tags=tags)
