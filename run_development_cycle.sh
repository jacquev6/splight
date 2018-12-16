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
    --workdirb|---workdireb-browser)
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

eval $(minikube docker-env)
mkdir -p coverage
PROCESSES=$(ps a)
# This doesn't seem to trigger events watched by nodemon
echo "$PROCESSES" | grep "minikube mount ./splight:/mounts/splight/sources" >/dev/null || (echo "Please run 'minikube mount ./splight:/mounts/splight/sources' in another terminal"; exit 1)
echo "$PROCESSES" | grep "minikube mount ./coverage:/mounts/splight/coverage" >/dev/null || (echo "Please run 'minikube mount ./coverage:/mounts/splight/coverage' in another terminal"; exit 1)
echo "$PROCESSES" | grep "minikube mount ./test-data:/mounts/splight/test-data" >/dev/null || (echo "Please run 'minikube mount ./test-data:/mounts/splight/test-data' in another terminal"; exit 1)

# @todo Allow running "npm install --save[-dev]" to modify package[-lock].json in sources
docker build --file Dockerfile.dev --tag splight-dev .

kubectl apply -f splight-admin.dev.yml

while ! kubectl get pod | grep "splight-admin.*Running" >/dev/null
do
  echo "Waiting for the pod"
  sleep 1
done

kubectl exec --stdin --tty $(kubectl get pod | grep "splight-admin.*Running" | cut -d " " -f 1) npm test

show_in_browser "Unit test coverage details" $PROJECT_ROOT/coverage/index.html

if $SERVE
then
  rm -rf test-data/repo
  git init test-data/repo >/dev/null
  cp -r test-data/data/* test-data/repo
  (
    cd test-data/repo
    git add .
    git commit -m "Initial commit"
    git config receive.denyCurrentBranch ignore
  ) >/dev/null

  echo "Admin website will be listening on $(minikube service splight-admin --url)/admin"
  trap true SIGINT
  kubectl exec --stdin --tty $(kubectl get pod | grep "splight-admin.*Running" | cut -d " " -f 1) npm run serve ./test-data/repo || true
  trap - SIGINT

  (
    cd test-data/repo
    git reset --hard >/dev/null
    git log --oneline
  )
  cp -r test-data/repo/* test-data/data
fi


# docker stop splight-dev >/dev/null &

echo
echo "Development cycle OK"
