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

mkdir -p coverage

CLUSTER=$(kubectl config current-context)
case $CLUSTER in
  minikube)
    echo "Using minikube"
    minikube status && echo
    eval $(minikube docker-env)
    PROCESSES=$(ps ux)
    RESTART_POD=false
    for MOUNT in $PROJECT_ROOT/splight:/mounts/splight/sources $PROJECT_ROOT/coverage:/mounts/splight/coverage $PROJECT_ROOT/test-data:/mounts/splight/test-data
    do
      if ! echo "$PROCESSES" | grep -e "minikube mount $MOUNT" >/dev/null
      then
        # "minikube mount" doesn't transmit events watched by nodemon
        minikube mount $MOUNT&
        RESTART_POD=true
      fi
    done
    if $RESTART_POD
    then
      kubectl delete -f splight-admin.dev.yml
    fi
    ;;
  *)
    echo "Unknown k8s dev cluster: $CLUSTER"
    exit 1;;
esac

# @todo Allow running "npm install --save[-dev]" to modify package[-lock].json in sources
docker build --file Dockerfile.dev --tag splight-dev .

kubectl apply -f splight-admin.dev.yml

while ! kubectl get pod | grep "splight-admin.*Running" >/dev/null
do
  echo "Waiting for the pod"
  sleep 1
done

function npm {
  kubectl exec --stdin --tty $(kubectl get pod | grep "splight-admin.*Running" | cut -d " " -f 1) npm "$@"
}

npm test

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

  case $CLUSTER in
    minikube)
      echo "Admin website will be listening on $(minikube service splight-admin --url)/admin"
      ;;
  esac
  trap true SIGINT
  npm run serve ./test-data/repo || true
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
