import datetime
import os
import types

import jinja2


class Colors:
    def __init__(
        self,
        *,
        primary_very_light,
        primary_light,
        primary,
        primary_dark,
        primary_very_dark,
        complement_very_light,
        complement_light,
        complement,
        complement_dark,
        complement_very_dark,
    ):
        assert isinstance(primary_very_light, str)
        self.__primary_very_light = primary_very_light
        assert isinstance(primary_light, str)
        self.__primary_light = primary_light
        assert isinstance(primary, str)
        self.__primary = primary
        assert isinstance(primary_dark, str)
        self.__primary_dark = primary_dark
        assert isinstance(primary_very_dark, str)
        self.__primary_very_dark = primary_very_dark
        assert isinstance(complement_very_light, str)
        self.__complement_very_light = complement_very_light
        assert isinstance(complement_light, str)
        self.__complement_light = complement_light
        assert isinstance(complement, str)
        self.__complement = complement
        assert isinstance(complement_dark, str)
        self.__complement_dark = complement_dark
        assert isinstance(complement_very_dark, str)
        self.__complement_very_dark = complement_very_dark

    @property
    def primary_very_light(self):
        return self.__primary_very_light

    @property
    def primary_light(self):
        return self.__primary_light

    @property
    def primary(self):
        return self.__primary

    @property
    def primary_dark(self):
        return self.__primary_dark

    @property
    def primary_very_dark(self):
        return self.__primary_very_dark

    @property
    def complement_very_light(self):
        return self.__complement_very_light

    @property
    def complement_light(self):
        return self.__complement_light

    @property
    def complement(self):
        return self.__complement

    @property
    def complement_dark(self):
        return self.__complement_dark

    @property
    def complement_very_dark(self):
        return self.__complement_very_dark


class Tag:
    def __init__(self, *, slug, title, border_color, background_color):
        assert isinstance(slug, str)
        self.__slug = slug
        assert isinstance(title, str)
        self.__title = title
        assert isinstance(border_color, str)
        self.__border_color = border_color
        assert isinstance(background_color, str)
        self.__background_color = background_color

    @property
    def slug(self):
        return self.__slug

    @property
    def title(self):
        return self.__title

    @property
    def border_color(self):
        return self.__border_color

    @property
    def background_color(self):
        return self.__background_color


class Location:
    def __init__(self, *, slug, name, description, official_website):
        assert isinstance(slug, str)
        self.__slug = slug
        assert isinstance(name, str)
        self.__name = name
        assert isinstance(description, list) and all(isinstance(d, str) for d in description)
        self.__description = description
        assert isinstance(official_website, str)
        self.__official_website = official_website

    @property
    def slug(self):
        return self.__slug

    @property
    def name(self):
        return self.__name

    def to_json(self):
        return dict(
            slug=self.__slug,
            name=self.__name,
            description=self.__description,
            official_website=self.__official_website,
        )


class Artist:
    def __init__(self, *, slug, name, description, official_website):
        assert isinstance(slug, str)
        self.__slug = slug
        assert isinstance(name, str)
        self.__name = name
        assert isinstance(description, list) and all(isinstance(d, str) for d in description)
        self.__description = description
        assert isinstance(official_website, str)
        self.__official_website = official_website

    @property
    def slug(self):
        return self.__slug

    @property
    def name(self):
        return self.__name

    def to_json(self):
        return dict(
            slug=self.__slug,
            name=self.__name,
            description=self.__description,
            official_website=self.__official_website,
        )


class City:
    def __init__(self, *, slug, name, tags):
        assert isinstance(slug, str)
        self.__slug = slug
        assert isinstance(name, str)
        self.__name = name
        assert isinstance(tags, list)
        assert all(isinstance(tag, Tag) for tag in tags)
        self.__tags = tags

    @property
    def slug(self):
        return self.__slug

    @property
    def name(self):
        return self.__name

    @property
    def tags(self):
        return self.__tags


class Week:
    def __init__(self, *, start_date):
        assert isinstance(start_date, datetime.date)
        self.__start_date = start_date

    @property
    def slug(self):
        return self.__start_date.strftime("%G-W%W")

    @property
    def start_date(self):
        return self.__start_date

    @property
    def previous(self):
        return Week(start_date=self.__start_date - datetime.timedelta(days=7))

    @property
    def next(self):
        return Week(start_date=self.__start_date + datetime.timedelta(days=7))

    @property
    def date_after(self):
        return self.next.start_date

    def for_context(self, first_week, week_after):
        return dict(
            title="Semaine du {}".format(_format_date(self.start_date)),
            previous_link_text="Semaine précédente",
            previous_link_slug=(self.previous.slug if self.previous.start_date >= first_week.start_date else ""),
            next_link_text="Semaine suivante",
            next_link_slug=(self.next.slug if self.date_after < week_after.start_date else ""),
            now_1_link_text="Cette semaine",
            now_2_link_text="La semaine prochaine",
        )


class ThreeDays:
    def __init__(self, *, start_date):
        assert isinstance(start_date, datetime.date)
        self.__start_date = start_date

    @property
    def slug(self):
        return self.__start_date.strftime("%Y-%m-%d+2")

    @property
    def start_date(self):
        return self.__start_date

    @property
    def previous(self):
        return ThreeDays(start_date=self.__start_date - datetime.timedelta(days=1))

    @property
    def next(self):
        return ThreeDays(start_date=self.__start_date + datetime.timedelta(days=1))

    @property
    def date_after(self):
        return self.__start_date + datetime.timedelta(days=3)

    def for_context(self, first_week, week_after):
        return dict(
            title="3 jours à partir du {}".format(_format_date(self.start_date)),
            previous_link_text="Jours précédents",
            previous_link_slug=(self.previous.slug if self.previous.start_date >= first_week.start_date else ""),
            next_link_text="Jours suivants",
            next_link_slug=(self.next.slug if self.date_after < week_after.start_date else ""),
            now_1_link_text="Ces trois jours",
            now_2_link_text="Ce week-end",
        )


class Day:
    def __init__(self, *, date):
        assert isinstance(date, datetime.date)
        self.__date = date

    @property
    def slug(self):
        return self.__date.strftime("%Y-%m-%d")

    @property
    def date(self):
        return self.__date

    @property
    def previous(self):
        return Day(date=self.__date - datetime.timedelta(days=1))

    @property
    def next(self):
        return Day(date=self.__date + datetime.timedelta(days=1))

    @property
    def date_after(self):
        return self.next.date

    def for_context(self, first_week, week_after):
        return dict(
            title="Journée du {}".format(_format_date(self.date)),
            previous_link_text="Jour précédent",
            previous_link_slug=(self.previous.slug if self.previous.date >= first_week.start_date else ""),
            next_link_text="Jour suivant",
            next_link_slug=(self.next.slug if self.date_after < week_after.start_date else ""),
            now_1_link_text="Aujourd'hui",
            now_2_link_text="Demain",
        )


class Event:
    def __init__(self, *, title, start, end, tags, border_color, background_color, location, artist):
        assert isinstance(title, str)
        self.__title = title
        assert isinstance(start, datetime.datetime)
        self.__start = start
        assert end is None or isinstance(end, datetime.datetime)
        self.__end = end
        assert isinstance(tags, list)
        assert all(isinstance(tag, str) for tag in tags)
        self.__tags = tags
        assert isinstance(border_color, str)
        self.__border_color = border_color
        assert isinstance(background_color, str)
        self.__background_color = background_color
        assert isinstance(location, str)
        self.__location = location
        assert artist is None or isinstance(artist, str)
        self.__artist = artist

    @property
    def title(self):
        return self.__title

    @property
    def start(self):
        return self.__start

    @property
    def end(self):
        return self.__end

    @property
    def tags(self):
        return self.__tags

    @property
    def border_color(self):
        return self.__border_color

    @property
    def background_color(self):
        return self.__background_color

    # @todo Remove json from templates.py, build json structure in generator.py
    def to_json(self):
        return dict(
            title=self.__title,
            start=self.__start.isoformat(),
            end=self.__end.isoformat() if self.__end else None,
            tags=self.__tags,
            borderColor=self.__border_color,
            backgroundColor=self.__background_color,
            location=self.__location,
            artist=self.__artist,
        )


def to_json(x):
    return x.to_json()


def _format_date(d):
    months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre",
    ]
    days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
    return d.strftime("{} %d {} %Y".format(days[d.weekday()], months[d.month - 1]))


def _format_time(t):
    if t.minute:
        format = "%Hh%M"
    else:
        format = "%Hh"
    return t.strftime(format)


class _Template:
    def __init__(self):
        self.environment = jinja2.Environment(
            loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
            trim_blocks=True,
            lstrip_blocks=True,
            undefined=jinja2.StrictUndefined,
        )
        self.environment.filters["format_date"] = _format_date
        self.environment.filters["format_time"] = _format_time

    def render(self):
        os.makedirs(os.path.dirname(self.destination), exist_ok=True)
        with open(self.destination, "w") as f:
            f.write(self.environment.get_template(self.template_name).render(self.context))
            f.write("\n")

    @property
    def destination(self):
        return "docs"

    @property
    def context(self):
        return dict()


class IndexCss(_Template):
    template_name = "index.css"

    def __init__(self, *, modernizr_features, colors):
        super().__init__()
        assert isinstance(modernizr_features, list)
        assert all(isinstance(feat, str) for feat in modernizr_features)
        self.__modernizr_features = modernizr_features
        assert isinstance(colors, Colors)
        self.__colors = colors

    @property
    def destination(self):
        return os.path.join(super().destination, "index.css")

    @property
    def context(self):
        return dict(
            colors=self.__colors,
            modernizr_features=self.__modernizr_features,
            **super().context,
        )


class _BaseHtml(_Template):
    pass


class IndexHtml(_BaseHtml):
    template_name = "index.html"

    def __init__(self, *, cities):
        super().__init__()
        assert isinstance(cities, list)
        assert all(isinstance(city, City) for city in cities)
        self.__cities = cities

    @property
    def destination(self):
        return os.path.join(super().destination, "index.html")

    @property
    def context(self):
        return dict(
            cities=self.__cities,
            **super().context,
        )


class AdsHtml(_BaseHtml):
    template_name = "ads.html"

    @property
    def destination(self):
        return os.path.join(super().destination, "ads", "index.html")


class CityBaseHtml(_BaseHtml):
    def __init__(self, *, city, first_week, week_after):
        super().__init__()
        assert isinstance(city, City)
        self.__city = city
        assert isinstance(first_week, Week)
        self.__first_week = first_week
        assert isinstance(week_after, Week)
        self.__week_after = week_after

    @property
    def first_week(self):
        return self.__first_week

    @property
    def week_after(self):
        return self.__week_after

    @property
    def destination(self):
        return os.path.join(super().destination, self.__city.slug)

    @property
    def context(self):
        return dict(
            city=self.__city,
            first_week=self.__first_week,
            week_after=self.__week_after,
            **super().context,
        )


class CityIndexHtml(CityBaseHtml):
    template_name = "city/index.html"

    def __init__(self, *, city, first_week, week_after):
        super().__init__(city=city, first_week=first_week, week_after=week_after)

    @property
    def destination(self):
        return os.path.join(super().destination, "index.html")


class CityTimespanHtml(CityBaseHtml):
    template_name = "city/timespan.html"

    def __init__(
        self, *,
        city, first_week, week_after,
        timespan,
    ):
        super().__init__(city=city, first_week=first_week, week_after=week_after)
        assert isinstance(timespan, (Week, ThreeDays, Day))
        self.__timespan = timespan

    @property
    def destination(self):
        return os.path.join(super().destination, self.__timespan.slug, "index.html")

    @property
    def context(self):
        return dict(
            timespan=self.__timespan.for_context(self.first_week, self.week_after),
            **super().context,
        )
