#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d%H%M%S")

rm -rf src
mkdir src
cp -r ../package.json ../package-lock.json ../serveLongRunningWebsite.js ../splight src
cp ../../papa-on-gcp.id_rsa* src
chmod 600 ssh-config src/papa-on-gcp.id_rsa*

echo "--------------------------------------------"
echo "Building splight-admin:$TAG"
echo "--------------------------------------------"

docker build -t splight-admin:$TAG .
rm -rf src

echo "--------------------------------------------"
echo "Produced splight-admin:$TAG"
echo "--------------------------------------------"

docker tag splight-admin:$TAG splight-admin:latest

docker tag splight-admin:$TAG eu.gcr.io/jacquev6-0001/splight-admin:$TAG
docker tag splight-admin:latest eu.gcr.io/jacquev6-0001/splight-admin:latest
docker push eu.gcr.io/jacquev6-0001/splight-admin:$TAG
docker push eu.gcr.io/jacquev6-0001/splight-admin:latest

echo "--------------------------------------------"
echo "Pushed splight-admin:$TAG"
echo "--------------------------------------------"

kubectl apply -f splight-admin.deployment.yml
kubectl apply -f splight-admin.service.yml
