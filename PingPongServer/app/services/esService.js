var index = "ping-pong-series";
var gameType = "game";
var userType = "user";

var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

function getUser(userId, cb) {
    client.get({
      index: index,
      type: userType,
      id: userId
    }, cb);
}
exports.getUser = getUser;

function getResults(username, from, size, cb) {
    client.search({
        index: index,
        type: gameType,
        body: {
            query: {
                nested: {
                    path: 'details',
                    query: {
                        term: {
                            'details.player': username
                        }
                    }
                }
//                match_all: {}
            },
            from: from,
            size: size
        }
    }, cb);
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