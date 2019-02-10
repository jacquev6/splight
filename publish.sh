#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d-%H%M%S")

echo "--------------------------------------------"
echo "Building jacquev6/splight:admin-$TAG"
echo "--------------------------------------------"

docker build --file splight-admin.prod.dockerfile --tag jacquev6/splight:admin-$TAG .

echo "--------------------------------------------"
echo "Building jacquev6/splight:backup-$TAG"
echo "--------------------------------------------"

docker build --file splight-backup.prod.dockerfile --tag jacquev6/splight:backup-$TAG .

echo "--------------------------------------------"
echo "Images built"
echo "--------------------------------------------"

docker push jacquev6/splight:admin-$TAG
docker push jacquev6/splight:backup-$TAG

echo "--------------------------------------------"
echo "Images pushed"
echo "--------------------------------------------"
