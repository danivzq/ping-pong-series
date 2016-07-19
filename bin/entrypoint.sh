#!/bin/sh
echo "Start elasticsearch..."

elasticsearch -Des.network.host=0.0.0.0 &
#sleeping 10 seconds to allow elasticsearch to start
sleep 10

echo "Check elasticsearch indexes..."
./build-index.sh localhost:9200

echo "Running the server..."
nodejs app.js