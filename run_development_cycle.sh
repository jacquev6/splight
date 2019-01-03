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

# @todo Does Helm solve this problem? (Generating k8s *.yml files from templates and variables, for dev, staging and prod)
function k8s_config {
  local F
  for F in *.dev.yml
  do
    echo "---"
    sed "s|MOUNT_ROOT|$MOUNT_ROOT|g" $F
  done
}

CLUSTER=$(kubectl config current-context)
case $CLUSTER in
  minikube)
    echo "Using minikube"
    minikube status && echo
    eval $(minikube docker-env)
    MOUNT_ROOT=/mounts/splight
    PROCESSES=$(ps ux)
    RESTART_POD=false
    for MOUNT in $PROJECT_ROOT/splight:/mounts/splight/splight $PROJECT_ROOT/coverage:/mounts/splight/coverage
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
      k8s_config | kubectl delete -f -
    fi
    ;;
  docker-for-desktop)
    echo "Using Docker for Mac"
    MOUNT_ROOT=$PROJECT_ROOT
    ;;
  *)
    echo "Unknown k8s dev cluster: $CLUSTER"
    exit 1;;
esac

# @todo Allow running "npm install --save[-dev]" to modify package[-lock].json in sources
docker build --file splight-admin.dev.dockerfile --tag splight-dev .

k8s_config | kubectl apply -f -

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
  for F in test-data/*.json
  do
    COLLECTION=${F%.json}
    COLLECTION=${COLLECTION#test-data/}
    cat $F | kubectl exec --stdin $(kubectl get pod | grep "splight-mongo.*Running" | cut -d " " -f 1) -- mongoimport --db splight --collection $COLLECTION --jsonArray --drop --quiet
  done

  case $CLUSTER in
    minikube)
      echo "Admin website will be listening on $(minikube service splight-admin --url)/admin"
      ;;
    docker-for-desktop)
      kubectl port-forward service/splight-admin 8080:80 >/dev/null 2>/dev/null&
      trap "kill $!" EXIT
      echo "Admin website will be listening on http://localhost:8080/admin"
      ;;
  esac
  trap true SIGINT
  npm run serve ./test-data/repo || true
  trap - SIGINT

  for F in test-data/*.json
  do
    COLLECTION=${F%.json}
    COLLECTION=${COLLECTION#test-data/}
    kubectl exec $(kubectl get pod | grep "splight-mongo.*Running" | cut -d " " -f 1) -- mongoexport --db splight --collection $COLLECTION --jsonArray --quiet | ./sort_by_id.py >$F
  done
fi

echo
echo "Development cycle OK"
