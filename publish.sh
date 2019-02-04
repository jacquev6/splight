#!/bin/bash

set -o errexit

TAG=$(date "+%Y%m%d-%H%M%S")

# sed -i "s/[0-9]\{8\}-[0-9]\{6\}/$TAG/g" splight/adminWebsite/page.html
# sed -i "s/:[0-9]\{8\}-[0-9]\{6\}/:$TAG/g" *prod.yml

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

# function k8s_config {
#   local F
#   for F in *.prod.yml
#   do
#     echo "---"
#     cat $F
#   done
# }

# k8s_config | kubectl apply -f -
