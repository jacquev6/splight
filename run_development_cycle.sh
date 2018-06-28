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

python3 -m unittest discover --verbose --start-directory tools --pattern "*.py"

if [ $(uname) == Linux ]
then
  fuser -k 4000/tcp >/dev/null 2>/dev/null || true
elif [ $(uname) == Darwin ]
then
  ps ux | grep http.server | grep -v grep | sed "s/^vincent\(......\).*$/\1/" | xargs kill -9
fi

echo

modernizr --config tools/generator/modernizr-config.json --dest tools/generator/skeleton/lib/modernizr-custom.js

if which opam >/dev/null
then
  eval `opam config env --switch=4.06.1.Splight.dev_with_newest_versions`
  opam install --yes JsOfOCairo General
  (cd tools/random-canvas; jbuilder build random_canvas.bc.js)
  ln -f tools/random-canvas/_build/default/random_canvas.bc.js tools/generator/skeleton/random_canvas.js
fi

python3 -m tools.generator data docs

git --no-pager diff --ignore-all-space --ignore-space-at-eol --ignore-blank-lines --stat docs

(cd docs; python3 -m http.server 4000) >>web.log 2>&1 &
show_in_browser "Website" "http://localhost:4000"

pycodestyle --max-line-length=120 $(git ls-files "*.py")

echo

python3 -m tools.checker docs
html5validator --root docs --show-warnings --also-check-css  # pip install html5validator

echo
echo "Development cycle OK"
