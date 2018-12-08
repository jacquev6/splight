#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d%H%M%S")

rm -rf src
mkdir src
cp -r ../package.json ../package-lock.json ../serveLongRunningWebsite.js ../splight src
cp ../../papa-on-gcp.id_rsa* src
chmod 600 ssh-config

echo "--------------------------------------------"
echo "Building splight-admin:$TAG"
echo "--------------------------------------------"

docker build -t splight-admin:$TAG .

echo "--------------------------------------------"
echo "Produced splight-admin:$TAG"
echo "--------------------------------------------"

docker tag splight-admin:$TAG eu.gcr.io/splight-0001/splight-admin:$TAG
docker tag splight-admin:$TAG eu.gcr.io/splight-0001/splight-admin:latest

docker push eu.gcr.io/splight-0001/splight-admin:$TAG
docker push eu.gcr.io/splight-0001/splight-admin:latest

echo "--------------------------------------------"
echo "Pushed splight-admin:$TAG"
echo "--------------------------------------------"

# docker run --rm --name splight-admin --publish 8000:80 splight-admin:$TAG
