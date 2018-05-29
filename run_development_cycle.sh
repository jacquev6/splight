#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

set -o errexit

rm -rf docs
jekyll build
mv _site docs
touch docs/.nojekyll
echo -n splight.fr >docs/CNAME

cd docs
# python -m SimpleHTTPServer 4000
cd ..

echo
echo "Development cycle OK"
