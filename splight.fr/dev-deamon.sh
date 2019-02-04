#!/bin/bash

CONTAINER_NAME=node${PWD//[\.\/]/-}

case $1 in
  start)
    echo "Starting container"
    docker run --detach --volume $PWD:/app --network host --workdir /app --name $CONTAINER_NAME --rm node:11.9 /app/dev-deamon.sh run
    echo "Don't forget to run \`eval \"\$(./dev-deamon.sh source)\"\`"
    ;;
  stop)
    echo "Stoping container"
    docker kill $CONTAINER_NAME
    ;;
  source)
    echo "# Please run \`eval \"\$(./dev-deamon.sh source)\"\`"
    echo "alias npm=\"docker exec --interactive --tty $CONTAINER_NAME npm\""
    echo "alias node=\"docker exec --interactive --tty $CONTAINER_NAME node\""
    ;;
  run)
    while true
    do
      # Less efficient than "chmod -R" but this way files are not touched and Dropbox is happier
      find /app -user root | while read f
      do
        chown 1000:1000 $f
      done
      sleep 60
    done
    ;;
esac
