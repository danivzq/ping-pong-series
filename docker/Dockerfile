FROM elasticsearch

#################
# Elasticsearch #
#################
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head
# index creation
ADD ping-pong-index.sh /tmp/ping-pong-index.sh

###########
# Node JS #
###########
RUN apt-get update
# install nodejs
RUN apt-get -y install nodejs
# install npm
RUN apt-get -y install npm