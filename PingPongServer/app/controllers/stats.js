var express = require('express'),
  router = express.Router(),
  esGameService = require('../services/esGameService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/stats/topten', function (req, res, next) {
  var username = req.session.username
  if(username){
    esGameService.getTopTen(
      function (error, data) {
        if(error){
          console.log(error);
          res.send(error);
        }else{
          res.set("username", username);
          res.send(data);
        }
      }
    );
  }else{
    res.render('login');
  }
});

router.get('/stats', function (req, res, next) {
  var username = req.session.username
  if(username){
    var from = req.query.from;
    var size = req.query.size;
    esGameService.getStats(username,
      function (error, data) {
        if(error){
          console.log(error);
        }else{
          res.render('player/stats', {
//            username: req.session.username,
//            fullname: req.session.fullname,
//            from: from,
//            size: size,
//            totalResults: data.hits.total,
//            results: data.hits.hits
          });
        }
      }
    );
  }else{
    res.render('login');
  }
});
