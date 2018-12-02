#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d%H%M%S")

rm -rf src
mkdir src
cp -r ../package.json ../package-lock.json ../serveLongRunningWebsite.js ../splight src

echo "--------------------------------------------"
echo "Building splight-admin:$TAG"
echo "--------------------------------------------"

docker build -t splight-admin:$TAG .

echo "--------------------------------------------"
echo "Produced splight-admin:$TAG"
echo "--------------------------------------------"

docker run --rm --name splight-admin --publish 8000:80 --volume $PWD/../test/data:/data --env SPLIGHT_DATA=/data splight-admin:$TAG
