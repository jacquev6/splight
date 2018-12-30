#!/bin/bash

set -o errexit

DATETIME=$1
echo $DATETIME | grep "^[0-9]\{8\}-[0-9]\{6\}$" || (echo "Datetime format: YYYMMDD-HHMMSS"; exit 1)

read -p "Restore Splight from $DATETIME backup? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  NOW=$(date "+%Y%m%d-%H%M%S")
  
  sed -i "s/- [0-9]\{8\}-[0-9]\{6\}$/- $DATETIME/g" splight-restore.manual-prod.yml
  sed -i "s/-[0-9]\{8\}-[0-9]\{6\}$/-$NOW/g" splight-restore.manual-prod.yml
  kubectl create -f splight-restore.manual-prod.yml
else
  echo "Canceled"
fi
