#!/bin/bash

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

(cd tools; npm test)

show_in_browser "Unit test coverage details" $PROJECT_ROOT/tools/coverage/index.html

(cd tools; npm run node generate-static-site.js ../test/data ../test/site)

# (cd tools; npm run generator ../data ../docs)
# git --no-pager diff --ignore-all-space --ignore-space-at-eol --ignore-blank-lines --stat docs
