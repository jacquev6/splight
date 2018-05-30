import os
import sys

import bs4


def main(root_dir_name):
    all_files = set(find_all_files(root_dir_name))
    check_local_links(root_dir_name, all_files)


def find_all_files(root_dir_name):
    for (current_dir_name, sub_dir_names, file_names) in os.walk(root_dir_name):
        for file_name in file_names:
            yield os.path.relpath(os.path.join(current_dir_name, file_name), root_dir_name)


def check_local_links(root_dir_name, all_files):
    served_urls = set(make_url(f) for f in all_files)
    linked_urls = set()
    for file_name in all_files:
        if file_name.endswith(".html"):
            with open(os.path.join(root_dir_name, file_name)) as f:
                soup = bs4.BeautifulSoup(f, "html.parser")
            for link in find_local_links(soup):
                if link == "" or link.startswith("mailto:") or link.startswith("http:") or link.startswith("https:"):
                    continue
                if not link.startswith("/"):
                    link = "{}/{}".format(make_url(file_name), link)
                linked_urls.add(link)
                if link not in served_urls:
                    print("DEAD LINK:", link, "in", file_name)
                    exit(1)


def make_url(file_name):
    file_name = "/{}".format(file_name)
    if file_name == "/index.html":
        return "/"
    elif file_name.endswith("/index.html"):
        return file_name[:-11]
    else:
        return file_name


def find_local_links(soup):
    for a in soup.find_all("a"):
        yield a["href"]
    for link in soup.find_all("link"):
        yield link["href"]
    for img in soup.find_all("img"):
        yield img["src"]


if __name__ == "__main__":
    main(sys.argv[1])
