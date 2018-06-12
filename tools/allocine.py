import base64
import hashlib
import itertools
import json
import os
import time
import urllib.parse

import requests
import simplejson


def request(method, **params):
    params.update(sed=time.strftime("%Y%m%d"), partner="100043982026", format="json")
    query_string = "&".join(["{}={}".format(k, v) for (k, v) in sorted(params.items())])
    sig = urllib.parse.quote_plus(base64.b64encode(
        hashlib.sha1(bytes("29d185d98c984a359e6e6f26a0474269" + query_string, "utf-8")).digest()
    ).decode("utf-8"))
    url = "http://api.allocine.fr/rest/v3/" + method + "?" + query_string + "&sig=" + sig

    try:
        with open("allocine_cache.json") as f:
            cache = json.load(f)
    except FileNotFoundError:
        cache = dict()

    data = cache.get(url)
    if data is None:
        r = requests.get(url, headers={"User-Agent": "Dalvik/1.6.0 (Linux; U; Android 4.2.2; Nexus 4 Build/JDQ39E)"})
        try:
            data = r.json()
        except simplejson.scanner.JSONDecodeError:
            print("ERROR while calling the AlloCiné API")
            print("URL:", url)
            print("Response:", r.text)
            exit(1)
        cache[url] = data
        with open("allocine_cache.json", "w") as f:
            json.dump(cache, f, sort_keys=True, indent=4)

    return data


places = {
    "P0053": "opera",
    "P0957": "gaumont",
}


data = request("showtimelist", theaters=",".join(sorted(places.keys())))


def title_(s):
    return s["onShow"]["movie"]["title"]


for theaterShowtime in data["feed"]["theaterShowtimes"]:
    location = places[theaterShowtime["place"]["theater"]["code"]]
    for (title, movieShowtimes) in itertools.groupby(sorted(theaterShowtime["movieShowtimes"], key=title_), key=title_):
        print('- title: "{}"'.format(title))
        print("  location:", location)
        print("  occurrences:")
        for (d, t) in sorted(
            (screening["d"].replace("-", "/"), time["$"])
            for movieShowtime in movieShowtimes
            for screening in movieShowtime["scr"]
            for time in screening["t"]
        ):
            print("    - datetime:", d, t)
