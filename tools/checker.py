import os
import sys

import bs4


def main(root_dir_name):
    all_files = set(find_all_files(root_dir_name))
    errors = sorted(check_local_links(root_dir_name, all_files))
    for error in errors:
        print(error)
    if errors:
        exit(1)


def find_all_files(root_dir_name):
    for (current_dir_name, sub_dir_names, file_names) in os.walk(root_dir_name):
        for file_name in file_names:
            yield os.path.relpath(os.path.join(current_dir_name, file_name), root_dir_name)


def check_local_links(root_dir_name, all_files):
    served_urls = set(make_url(f) for f in all_files)

    links = dict()
    for file_name in all_files:
        if file_name.endswith(".html"):
            with open(os.path.join(root_dir_name, file_name)) as f:
                soup = bs4.BeautifulSoup(f, "html.parser")
            links[make_url(file_name)] = set(keep_interesting_links(file_name, find_local_links(soup)))

    for (file_name, file_links) in links.items():
        for link in file_links - served_urls:
            yield "DEAD LINK: {} in {}".format(link, file_name)

    reacheable = set()

    def aux(url):
        url_links = links.get(url, set())
        reacheable.add(url)
        for link in url_links:
            if link not in reacheable:
                aux(link)

    aux("/ads/")
    aux("/CNAME")
    aux("/.nojekyll")
    aux("/")
    reacheable.add("/external.svg")

    aux("/reims/2018-05-21/")
    aux("/reims/2018-05-21+2/")
    for w in range(21, 52):
        reacheable.add("/reims/2018-W{}.json".format(w))

    for url in served_urls - reacheable:
        yield "UNREACHABLE URL: {}".format(url)


def make_url(file_name):
    file_name = "/{}".format(file_name)
    if file_name.endswith("/index.html"):
        return file_name[:-10]
    else:
        return file_name


def find_local_links(soup):
    for a in soup.find_all("a"):
        yield a["href"]
    for link in soup.find_all("link"):
        yield link["href"]
    for img in soup.find_all("img"):
        yield img["src"]
    for script in soup.find_all("script"):
        src = script.get("src")
        if src:
            yield src


def keep_interesting_links(file_name, links):
    for link in links:
        link = link.split("?")[0]
        if link == "" or link.startswith("mailto:") or link.startswith("http:") or link.startswith("https:"):
            continue
        if not link.startswith("/"):
            link = "{}{}".format(make_url(file_name), link)
        yield link.replace("//", "/")


if __name__ == "__main__":
    main(sys.argv[1])
