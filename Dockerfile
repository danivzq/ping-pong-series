FROM elasticsearch

#################
# Elasticsearch #
#################
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head

#############################
# NPM and Node installation #
#############################
RUN apt-get update && apt-get install -y \
  nodejs \
  npm

##########
#  App   #
##########
ADD PingPongServer /opt/ping-pong-server/PingPongServer
WORKDIR /opt/ping-pong-server/PingPongServer
# install packages
RUN npm install

#############
#  Scripts  #
#############
ADD scripts /opt/ping-pong-server/scripts

##############
# Entrypoint #
##############
ENTRYPOINT ["/opt/ping-pong-server/scripts/entrypoint.sh"]