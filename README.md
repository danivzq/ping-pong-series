# Ping-Pong Series
## Get Docker images
```sudo docker images```
## Build Docker image:
```sudo docker build -t ping-pong-server .```
## Run Docker container: 
Daemon: ```sudo docker run -d --name ping01 ping-pong-server```
Foreground: ```sudo docker run --name ping01 ping-pong-server```
Host: ```sudo docker run --net="host" --name ping01 ping-pong-server```
## Stop Docker container: 
```sudo docker stop ping01```
## Get all containers
```sudo docker ps -a```
## Get running containers
```sudo docker ps```
## Remove container
```sudo docker rm ping01```
## Get the container details
```sudo docker inspect ping01```
## Get the container shell
```sudo docker exec -t -i ping01 /bin/bash```
## Get the container IP Address
```sudo docker inspect ping01 | grep IPAddress```
## Copy a file from the container
docker cp <containerId>:/file/path/within/container /host/path/target