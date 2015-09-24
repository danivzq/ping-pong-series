FROM elasticsearch

#################
# Elasticsearch #
#################
# install plugins in elasticsearch
RUN plugin -i mobz/elasticsearch-head
# index creation
ADD ping-pong-index.sh /tmp/ping-pong-index.sh