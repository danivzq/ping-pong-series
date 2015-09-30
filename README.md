# Ping-Pong Series

## Build Docker Image: 
```sudo docker build -t ping-pong-server .```
## Run Docker Image: 
```sudo docker run -d --name ping01 ping-pong-server```
## Stop Docker Image: 
```sudo docker stop ping01```
## Get the container shell
```sudo docker exec -t -i ping01 /bin/bash```