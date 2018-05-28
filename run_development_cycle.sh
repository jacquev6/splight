#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

rm -rf docs
jekyll build
mv _site docs
touch docs/.nojekyll
echo -n splight.fr >docs/CNAME

echo
echo "Development cycle OK"
