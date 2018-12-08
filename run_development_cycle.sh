#!/bin/bash

set -o errexit

PROJECT_ROOT=$(pwd)

SERVE_DEVELOPER_SITE=false
SERVE_WEBMASTER_SITE=false
GENERATE=true

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
    -sg|--skip-generation)
      GENERATE=false
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

if $GENERATE || $SERVE_DEVELOPER_SITE || $SERVE_WEBMASTER_SITE
then
  rm -rf /tmp/splight-test-data
  git init /tmp/splight-test-data >/dev/null
  cp -r test/data/* /tmp/splight-test-data
  (
    cd /tmp/splight-test-data
    git add .
    git commit -m "Initial commit"
    git config receive.denyCurrentBranch ignore
  ) >/dev/null
  npm run generateMissingImages /tmp/splight-test-data
fi

npm test

show_in_browser "Unit test coverage details" $PROJECT_ROOT/coverage/index.html

if $GENERATE
then
  npm run generatePublicWebsite /tmp/splight-test-data test/site

  if [ -d ../splight.fr-data -a -d ../splight.fr ]
  then
    npm run generateMissingImages ../splight.fr-data
    npm run generatePublicWebsite ../splight.fr-data ../splight.fr/docs
  fi
fi

if $SERVE_DEVELOPER_SITE
then
  trap true SIGINT
  npm run serveDeveloperWebsite /tmp/splight-test-data || true
  trap - SIGINT
fi

if $SERVE_WEBMASTER_SITE
then
  npm run serveWebmasterWebsite /tmp/splight-test-data
fi

if $SERVE_DEVELOPER_SITE || $SERVE_WEBMASTER_SITE
then
  (
    cd /tmp/splight-test-data
    git reset --hard >/dev/null
    git log --oneline
  )
  cp -r /tmp/splight-test-data/* test/data
fi

echo
echo "Development cycle OK"
