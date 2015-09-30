#!/bin/sh
echo "Start elasticsearch..."
elasticsearch &
#sleeping 10 seconds to allow elasticsearch to start
sleep 10
echo "Build elasticsearch indexes..."
/opt/ping-pong-server/scripts/build-index.sh localhost:9200

echo "Running the server..."
nodejs app.js