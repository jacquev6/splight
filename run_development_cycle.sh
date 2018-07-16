#!/bin/bash

set -o errexit

PROJECT_ROOT=$(pwd)

SERVE_DEVELOPER_SITE=false
SERVE_WEBMASTER_SITE=false

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
    -ds|--serve-developer-website)
      SERVE_DEVELOPER_SITE=true
      SERVE_WEBMASTER_SITE=false
      ;;
    -ws|--serve-webmaster-website)
      SERVE_WEBMASTER_SITE=true
      SERVE_DEVELOPER_SITE=false
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done

npm test

show_in_browser "Unit test coverage details" $PROJECT_ROOT/coverage/index.html

npm run generatePublicWebsite test/data.json test/site

if $SERVE_DEVELOPER_SITE
then
  npm run serveDeveloperWebsite test/data.json
fi

if $SERVE_WEBMASTER_SITE
then
  npm run serveWebmasterWebsite test/data.json
fi

echo
echo "Development cycle OK"
