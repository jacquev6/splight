PROJECT_ROOT=$PWD

function run_in_dev_daemon {
  # --workdir complains about API versions (1.25 vs. 1.35)
  DIRECTORY=$(echo $PWD | sed "s#$PROJECT_ROOT#/app#")
  docker-compose exec dev-daemon bash -c "cd $DIRECTORY; $@"
}

function npm {
  run_in_dev_daemon "npm $@"
}

function node {
  run_in_dev_daemon "node $@"
}
