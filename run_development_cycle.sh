#!/bin/bash

set -o errexit

PROJECT_ROOT=$(pwd)

SERVE_ADMIN_SITE=false

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
    -as|--admin-site)
      SERVE_ADMIN_SITE=true
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done

npm test

show_in_browser "Unit test coverage details" $PROJECT_ROOT/coverage/index.html

npm run generatePublicWebsite test/data test/site

if $SERVE_ADMIN_SITE
then
  npm run serveAdminSite test/data
fi

echo
echo "Development cycle OK"
