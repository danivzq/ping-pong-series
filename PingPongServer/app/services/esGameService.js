var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var index = "ping-pong-series";
var gameType = "game";

function searchGames(username, from, size, filters, sort, cb) {
    if(filters == null){
      client.search({
            index: index,
            type: gameType,
            body: {
              query: {
                filtered: {
                  query: {
                    nested: {
                      path: 'details',
                      query: {
                        term: {
                          'details.player': username
                        }
                      }
                    }
                  }
                }
              },
              sort: sort,
              aggregations: {
                matchType: {
                  terms: {
                    field: 'matchType'
                  }
                },
                gameType: {
                  terms: {
                    field: 'gameType'
                  }
                },
                victories: {
                  filter: {
                    term: {
                      winner: username
                    }
                  }
                },
                defeats: {
                  filter: {
                    bool: {
                      must_not: {
                        term: {
                          winner: username
                        }
                      }
                    }
                  }
                }
              },
              from: from,
              size: size
            }
          }, cb);
    }else{
      client.search({
            index: index,
            type: gameType,
            body: {
              query: {
                filtered: {
                  query: {
                    nested: {
                      path: 'details',
                      query: {
                        term: {
                          'details.player': username
                        }
                      }
                    }
                  },
                  filter: {
                    bool: {
                      must: filters
                    }
                  }
                }
              },
              sort: sort,
              aggregations: {
                matchType: {
                  terms: {
                    field: 'matchType'
                  }
                },
                gameType: {
                  terms: {
                    field: 'gameType'
                  }
                },
                victories: {
                  filter: {
                    term: {
                      winner: username
                    }
                  }
                },
                defeats: {
                  filter: {
                    bool: {
                      must_not: {
                        term: {
                          winner: username
                        }
                      }
                    }
                  }
                }
              },
              from: from,
              size: size
            }
          }, cb);
    }
}
exports.searchGames = searchGames;

function createGame(doc, cb) {
  client.index({
    index: index,
    type: gameType,
    body: doc
  }, cb);
}
exports.createGame = createGame;

function updateGame(id, doc, cb) {
  client.update({
    index: index,
    type: gameType,
    id: id,
    body: {
      doc: doc
    }
  }, cb);
}
exports.updateGame = updateGame;

function confirmGame(id, cb) {
  client.update({
    index: index,
    type: gameType,
    id: id,
    body: {
      doc: {
        'status' : 'CONFIRMED'
      }
    }
  }, cb);
}
exports.confirmGame = confirmGame;

function deleteGame(id, cb) {
  client.delete({
    index: index,
    type: gameType,
    id: id
  }, cb);
}
exports.deleteGame = deleteGame;

function getTopTen(cb) {
  client.search({
    index: index,
    type: gameType,
    body: {
      size: 0,
      query: {
        bool: {
          must_not: {
            term: {
              'gameType': 'training'
            }
          }
        }
      },
      aggs: {
        'topwins': {
          terms: {
            field: 'winner'
          }
        },
        'toppoints': {
          nested: {
            path: 'details'
          },
          aggs: {
            'user': {
              terms: {
                field: 'details.player',
                order: {
                  'points': 'desc'
                }
              },
              aggs: {
                'points': {
                  sum: {
                    field: 'details.totalPoints'
                  }
                }
              }
            }
          }
        },
        'topsets': {
          nested: {
            path: 'details'
          },
          aggs: {
            'user': {
              terms: {
                field: 'details.player',
                order: {
                  'sets': 'desc'
                }
              },
              aggs: {
                'sets': {
                  sum: {
                    field: 'details.wonSets'
                  }
                }
              }
            }
          }
        }
      }
    }
  }, cb);
}
exports.getTopTen = getTopTen;