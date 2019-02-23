#!/bin/bash

set -o errexit
set -u
shopt -s nullglob

PUSH=false

while [[ "$#" > 0 ]]
do
  case $1 in
    --push)
      PUSH=true
      ;;
    *)
      echo "Unknown parameter passed: $1"
      exit 1;;
  esac
  shift
done

DATE_TAG=$(date "+%Y%m%d-%H%M%S")

function build {
  local BASE_TAG=$1
  shift

  echo "Building jacquev6/splight:$DATE_TAG.$BASE_TAG"
  echo "Building jacquev6/splight:$DATE_TAG.$BASE_TAG" | sed "s/./=/g"
  docker build "$@" --tag jacquev6/splight:$DATE_TAG.$BASE_TAG .
  docker tag jacquev6/splight:$DATE_TAG.$BASE_TAG jacquev6/splight:latest.$BASE_TAG

  if $PUSH
  then
    docker push jacquev6/splight:$DATE_TAG.$BASE_TAG
  fi
  echo
}

for DIRECTORY in $(find . -name "*Dockerfile" | grep -v node_modules | while read f; do dirname $f; done | sort -u)
do
  cd $DIRECTORY

  if [ -f Dockerfile ]
  then
    build ${DIRECTORY#./}
  fi

  for f in *.Dockerfile
  do
    build ${DIRECTORY#./}.${f%.Dockerfile} -f $f
  done

  cd - >/dev/null
done
