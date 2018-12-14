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
    --workdirb|---workdireb-browser)
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

# @todo Allow running "npm install --save[-dev]" to modify package[-lock].json in sources
docker build --file Dockerfile.dev --tag splight-dev .

docker run --detach --rm --name splight-dev \
  --volume $PWD/splight:/app/splight \
  --volume $PWD/coverage:/app/coverage \
  --volume /tmp:/tmp \
  --publish 8000:80 \
  splight-dev \
  tail -f /dev/null \
  >/dev/null

docker exec --tty splight-dev npm test

show_in_browser "Unit test coverage details" $PROJECT_ROOT/coverage/index.html

if $SERVE
then
  rm -rf /tmp/splight-test-data
  git init /tmp/splight-test-data >/dev/null
  cp -r test-data/* /tmp/splight-test-data
  (
    cd /tmp/splight-test-data
    git add .
    git commit -m "Initial commit"
    git config receive.denyCurrentBranch ignore
  ) >/dev/null

  trap true SIGINT
  docker exec --tty splight-dev npm run serve /tmp/splight-test-data || true
  trap - SIGINT

  (
    cd /tmp/splight-test-data
    git reset --hard >/dev/null
    git log --oneline
  )
  cp -r /tmp/splight-test-data/* test-data
fi

docker stop splight-dev >/dev/null &

echo
echo "Development cycle OK"
