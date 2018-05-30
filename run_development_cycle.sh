#!/bin/bash

# Copyright 2018 Vincent Jacques <vincent@vincent-jacques.net>

set -o errexit

PROJECT_ROOT=$(pwd)

SHOW_IN_BROWSER=false
function show_in_browser {
  echo
  echo "$1: $2"
  echo
  if $SHOW_IN_BROWSER
  then
    python -m webbrowser -t $2
  fi
}

while [[ "$#" > 0 ]]
do
  case $1 in
    -wb|--web-browser)
      SHOW_IN_BROWSER=true
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done

python3 -m unittest --verbose tools.tests

fuser -k 4000/tcp >/dev/null 2>/dev/null || true

python3 -m tools.generator . docs

python3 -m tools.checker docs

git diff --ignore-all-space --ignore-space-at-eol --ignore-blank-lines --stat docs

(cd docs; python -m SimpleHTTPServer 4000) >>web.log 2>&1 &
show_in_browser "Website" "http://localhost:4000"

pycodestyle --max-line-length=120 $(git ls-files "*.py")

echo
echo "Development cycle OK"
