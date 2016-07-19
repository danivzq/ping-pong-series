FROM elasticsearch:2.1
# install plugins in elasticsearch
RUN ./bin/plugin install lmenezes/elasticsearch-kopf/v2.1.1

#############################
# NPM and Node installation #
#############################
RUN apt-get update 
RUN apt-get install -y \
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
USER elasticsearch
ENTRYPOINT ["bin/entrypoint.sh"]