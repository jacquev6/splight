#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

set -o errexit

rm -rf docs
mkdir -p docs/ads
cp -r ads/*.png docs/ads
cp *.jpg docs
./generate.py docs
touch docs/.nojekyll
echo -n splight.fr >docs/CNAME

git diff --ignore-all-space --stat --exit-code docs

cd docs
# python -m SimpleHTTPServer 4000
cd ..

echo
echo "Development cycle OK"
