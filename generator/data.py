import os

from . import multi_yaml


def load(source_directory):
    return multi_yaml.load(os.path.join(source_directory, "data"))
