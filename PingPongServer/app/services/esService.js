var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var index = "ping-pong-series";

/* USER */
var userType = "user";
function getUser(userId, cb) {
  client.get({
    index: index,
    type: userType,
    id: userId
  }, cb);
}
exports.getUser = getUser;

function updateUser(email, fullname, password, cb) {
  var username = email.split("@")[0]

  client.update({
    index: index,
    type: userType,
    id: username,
    body: {
      doc: {
        'username': username,
        'password': password,
        'email': email,
        'fullname': fullname
      }
    }
  }, cb);
}
exports.updateUser = updateUser;

function insertUser(email, fullname, password, cb) {
  var username = email.split("@")[0]

  client.index({
    index: index,
    type: userType,
    id: username,
    body: {
      'username': username,
      'password': password,
      'email': email,
      'fullname': fullname
    }
  }, cb);
}
exports.insertUser = insertUser;


/* GAME */
var gameType = "game";
function getResults(username, from, size, filters, cb) {
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
              sort: {
                date: 'desc'
              },
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
              sort: {
                date: 'desc'
              },
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
exports.getResults = getResults;

function getStats(username, cb) {
    client.search({
        index: index,
        type: gameType,
        body: {
            query: {
                match_all: {}
            }
        }
    }, cb);
}
exports.getStats = getStats;
