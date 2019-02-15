#!/bin/bash

set -o errexit
set -u

DATE_TAG=$(date "+%Y%m%d-%H%M%S")
HOST_TAG=latest-built-on-$(hostname)

for DOCKERFILE in */Dockerfile
do
  DIRECTORY=${DOCKERFILE%/Dockerfile}
  BASE_TAG=jacquev6/splight:$DIRECTORY
  cd $DIRECTORY
  echo "Building ${BASE_TAG}_$DATE_TAG"
  echo "Building ${BASE_TAG}_$DATE_TAG" | sed "s/./=/g"
  docker build --tag ${BASE_TAG}_$DATE_TAG .
  docker tag ${BASE_TAG}_$DATE_TAG ${BASE_TAG}_$HOST_TAG

  # Keep one image built by each host. This way all `docker push`es will have as many "Layer already exists" as possible.
  docker push ${BASE_TAG}_$HOST_TAG
  # Images tagged with a date can all be deleted except the last one.
  docker push ${BASE_TAG}_$DATE_TAG
  cd ..
done
