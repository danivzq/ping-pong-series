FROM elasticsearch
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head

#############################
# NPM and Node installation #
#############################
RUN apt-get update && apt-get install -y \
  nodejs \
  npm \
  vim \
  vim-common \
  vim-gnome \
  vim-gui-common \
  vim-runtime 

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

#############
# Resources #
#############
ADD resources/elasticsearch.yml /usr/share/elasticsearch/config/elasticsearch.yml

##############
# Entrypoint #
##############
ENTRYPOINT ["bin/entrypoint.sh"]