#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

set -o errexit

python3 -m generator . docs

git diff --ignore-all-space --ignore-space-at-eol --ignore-blank-lines --stat docs

cd docs
# python -m SimpleHTTPServer 4000
cd ..

echo
echo "Development cycle OK"
