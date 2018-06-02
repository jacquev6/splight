import copy
import json
import os.path
import unittest

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


def dict_to_list(d):
    return list(v for (k, v) in sorted(d.items()))


def merge(x, y):
    x = copy.deepcopy(x)
    y = copy.deepcopy(y)
    if x is None:
        return y
    elif y is None:
        return x
    elif isinstance(x, list) and isinstance(y, list):
        return x + y
    elif isinstance(x, dict) and isinstance(y, dict):
        for (k, v) in y.items():
            x[k] = merge(x.get(k), v)
        return x
    elif isinstance(x, list) and isinstance(y, dict):
        return merge(x, dict_to_list(y))
    elif isinstance(x, dict) and isinstance(y, list):
        return merge(dict_to_list(x), y)
    else:
        assert False, ("Types incompatible for merging:", x, y)


class DeepMergeTestCase(unittest.TestCase):
    def run_test(self, x, y, r):
        x2 = copy.deepcopy(x)
        y2 = copy.deepcopy(y)
        self.assertEqual(merge(x, y), r)
        self.assertEqual(x, x2)
        self.assertEqual(y, y2)

    def test_none(self):
        self.run_test(None, ["a"], ["a"])
        self.run_test(["a"], None, ["a"])

    def test_lists(self):
        self.run_test(["a", "c"], ["d", "b"], ["a", "c", "d", "b"])

    def test_dicts(self):
        self.run_test({"a": 1, "c": 3}, {"d": 4, "b": 2}, {"a": 1, "b": 2, "c": 3, "d": 4})

    def test_lists_in_dict(self):
        self.run_test({"k": ["a"]}, {"k": ["b"]}, {"k": ["a", "b"]})

    def test_dicts_in_dict(self):
        self.run_test({"k": {"a": 1}}, {"k": {"b": 2}}, {"k": {"a": 1, "b": 2}})


def load(dir_name):
    contents = None

    for (ext, loader) in loaders.items():
        for file_name in [
            "{}{}".format(dir_name, ext),
            os.path.join(dir_name, ext),
        ]:
            if os.path.isfile(file_name):
                with open(file_name) as f:
                    contents = merge(contents, loader(f))

    if os.path.isdir(dir_name):
        keys = set(make_key(dir_name, name) for name in os.listdir(dir_name))
        keys.discard(None)
        contents = merge(contents, {key: load(os.path.join(dir_name, key)) for key in keys})

    return contents


class LoadTestCase(unittest.TestCase):
    def do_test(self, name):
        with open(os.path.join(os.path.dirname(__file__), "tests", "outputs", "{}.json".format(name))) as f:
            expected = json.load(f)
        actual = load(os.path.join(os.path.dirname(__file__), "tests", "inputs", name))
        self.assertEqual(actual, expected)


for name in os.listdir(os.path.join(os.path.dirname(__file__), "tests", "outputs")):
    assert name.endswith(".json")
    name = name[:-5]
    setattr(LoadTestCase, "test_{}".format(name), (lambda name: lambda self: self.do_test(name))(name))
