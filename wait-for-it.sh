#!/bin/bash
# wait-for-it.sh

HOST=$1
PORT=$2
TIMEOUT=${3:-30}

nc -z $HOST $PORT
while [ $? -ne 0 ]; do
  echo "Waiting for $HOST:$PORT..."
  sleep 1
  nc -z $HOST $PORT
done
echo "$HOST:$PORT is up"
