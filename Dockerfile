FROM elasticsearch
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head

#############################
# NPM and Node installation #
#############################
RUN apt-get update && apt-get install -y \
  nodejs \
  npm

ENV appname ping-pong-server

##########
#  App   #
##########
WORKDIR /opt/${appname}
ADD PingPongServer .
# install packages
RUN npm install

#############
#  Scripts  #
#############
ADD bin bin

##############
# Entrypoint #
##############
ENTRYPOINT ["bin/entrypoint.sh"]