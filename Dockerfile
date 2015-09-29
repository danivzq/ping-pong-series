FROM elasticsearch

#################
# Elasticsearch #
#################
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head

###########
# Node JS #
###########
RUN apt-get update
# install nodejs
RUN apt-get -y install nodejs
# install npm
RUN apt-get -y install npm

##########
#  App   #
##########
ADD PingPongServer /tmp/PingPongServer
WORKDIR /tmp/PingPongServer

# install packages
RUN npm install

# TODO define entrypoint index creation
ADD ping-pong-index.sh /tmp/ping-pong-index.sh