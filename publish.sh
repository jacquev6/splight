#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d%H%M%S")

cp ../papa-on-gcp.id_rsa ssh/id_rsa
cp ../papa-on-gcp.id_rsa.pub ssh/id_rsa.pub
chmod 600 ssh/*

sed -i "s|Splight - [0-9]\+</title>$|Splight - $TAG</title>|" splight/adminWebsite/page.html
sed -i "s/splight-admin:[0-9]\+$/splight-admin:$TAG/" splight-admin.prod.yml

echo "--------------------------------------------"
echo "Building eu.gcr.io/jacquev6-0001/splight-admin:$TAG"
echo "--------------------------------------------"

docker build --file Dockerfile.prod --tag eu.gcr.io/jacquev6-0001/splight-admin:$TAG .

echo "--------------------------------------------"
echo "Produced eu.gcr.io/jacquev6-0001/splight-admin:$TAG"
echo "--------------------------------------------"

docker push eu.gcr.io/jacquev6-0001/splight-admin:$TAG

echo "--------------------------------------------"
echo "Pushed eu.gcr.io/jacquev6-0001/splight-admin:$TAG"
echo "--------------------------------------------"

kubectl apply -f splight-admin.prod.yml
