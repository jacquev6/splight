#!/bin/bash

set -o errexit

PROJECT_ROOT=$(pwd)

SERVE=false

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
    -s|--serve)
      SERVE=true
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done

. ./dev-daemon/aliases.sh

(cd api; npm test)
show_in_browser "Unit test coverage details" $PROJECT_ROOT/api/coverage/index.html

(cd test-data; npm "run lint")

if $SERVE
then
  dev-daemon-docker-compose up -d

  (cd test-data; npm "run restore")

  echo "Servers are running"
fi

echo
echo "Development cycle OK"
