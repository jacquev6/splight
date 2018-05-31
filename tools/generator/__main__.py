import sys

from .generator import generate


if __name__ == "__main__":
    generate(source_directory=sys.argv[1], destination_directory=sys.argv[2])
