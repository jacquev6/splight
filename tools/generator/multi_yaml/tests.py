import json
import os
import unittest

from . import load


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
