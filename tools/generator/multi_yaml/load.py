import json
import os.path

import yaml


loaders = {
    ".json": json.load,
    ".yaml": yaml.load,
    ".yml": yaml.load,
}


def make_key(dir_name, name):
    (radix, ext) = os.path.splitext(name)
    if ext in loaders.keys():
        return radix
    elif os.path.isdir(os.path.join(dir_name, name)):
        return name
    else:
        return None


def load(dir_name, initial_value=None):
    has_data = False

    for (ext, loader) in loaders.items():
        file_name = "{}{}".format(dir_name, ext)
        if os.path.isfile(file_name):
            break
        file_name = os.path.join(dir_name, ext)
        if os.path.isfile(file_name):
            break
    else:
        file_name = None

    if file_name:
        has_data = True
        with open(file_name) as f:
            contents = loader(f)
    elif isinstance(initial_value, (dict, list)):
        contents = initial_value
    else:
        assert initial_value is None
        contents = {}

    if os.path.isdir(dir_name):
        has_data = True
        keys = set(make_key(dir_name, name) for name in os.listdir(dir_name))
        keys.discard(None)
        if isinstance(contents, dict):
            contents.update({key: load(os.path.join(dir_name, key), contents.get(key)) for key in keys})
        elif isinstance(contents, list):
            contents.extend([load(os.path.join(dir_name, key)) for key in sorted(keys)])
        else:
            assert False

    if has_data:
        return contents
    else:
        return None
