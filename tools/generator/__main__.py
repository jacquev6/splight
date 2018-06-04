import sys

from .generator import generate


# Name guard necessary because "python -m unittest discover" imports the module as "generator.__main__"
if __name__ == "__main__":
    generate(data_directory=sys.argv[1], destination_directory=sys.argv[2])
