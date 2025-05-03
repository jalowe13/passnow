#!/bin/bash
# Jacob Lowe
# Start Passnow Application Linux
#
# Choice of Start and stop
CONTAINER_ID="ca5a154000a5"
read -p "Start or Stop Container?: [y/n]" CHOICE
echo $CHOICE

if [[ $CHOICE == "y" ]]; then
  echo "True"
  docker start "$CONTAINER_ID"
  docker ps -a
else
  echo "False $CONTAINER_ID"
  docker stop "$CONTAINER_ID"
  docker ps -a
fi
