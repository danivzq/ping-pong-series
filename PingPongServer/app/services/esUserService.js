var elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

var index = "ping-pong-series";
var userType = "user";

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