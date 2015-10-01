# Ping-Pong Series
## Get Docker images
```sudo docker images```
## Build Docker image:
```sudo docker build -t ping-pong-server .```
## Run Docker container: 
```sudo docker run -d --name ping01 ping-pong-server```
## Stop Docker container: 
```sudo docker stop ping01```
## Get running containers
```sudo docker ps```
## Get the container details
```sudo docker inspect ping01```
## Get the container shell
```sudo docker exec -t -i ping01 /bin/bash```
## Get the container IP Address
```sudo docker inspect ping01 | grep IPAddress```