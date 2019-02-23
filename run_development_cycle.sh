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

# Long version --detach unavailable on Ubuntu
docker-compose up -d dev-daemon
. ./development_aliases.sh

(cd api; npm test)
show_in_browser "Unit test coverage details" $PROJECT_ROOT/api/coverage/index.html

if $SERVE
then
  docker-compose up -d

  for F in test-data/*.json
  do
    COLLECTION=${F%.json}
    COLLECTION=${COLLECTION#test-data/}
    echo "Restoring $COLLECTION"
    # 'docker-compose exec' doesn't seem to handle input data on stdin on Ubuntu
    cat $F | docker exec --interactive splightfr_mongo_1 mongoimport --db splight --collection $COLLECTION --jsonArray --drop --quiet
  done

  echo "Press Enter to exit"
  read

  for F in test-data/*.json
  do
    COLLECTION=${F%.json}
    COLLECTION=${COLLECTION#test-data/}
    echo "Dumping $COLLECTION"
    docker-compose exec -T mongo mongoexport --db splight --collection $COLLECTION --sort "{_id:1}" --jsonArray --quiet --pretty >$F
  done

  docker-compose down
fi

echo
echo "Development cycle OK"
