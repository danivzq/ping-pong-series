var express = require('express'),
  router = express.Router(),
  esService = require('../services/esService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/results', function (req, res, next) {
  var username = req.session.username
  if(username){
    var from = req.query.from;
    var size = req.query.size;
    esService.getResults(username, from, size,
      function (error, data) {
        if(error){
          console.log(error);
        }else{
          res.render('player/results', {
            username: req.session.username,
            fullname: req.session.fullname,
            from: from,
            size: size,
            totalResults: data.hits.total,
            results: data.hits.hits
          });
        }
      }
    );
  }else{
    res.render('login', {
      title: 'Stratio Ping-Pong Series'
    });
  }
});
