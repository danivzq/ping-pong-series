

var express = require('express'),
  config = require('./config/config');
var session = require('express-session');
var app = express();

app.use(session(
  {
    secret: '193728465ALYBGJQP',
    resave: false,
    saveUninitialized: false
  }
));

require('./config/express')(app, config);

app.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

