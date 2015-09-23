var express = require('express'),
  router = express.Router(),
  esGameService = require('../services/esGameService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/matches', function (req, res, next) {
  var username = req.session.username
  if(username){
    var from = req.query.from;
    var size = req.query.size;
    var filters = [{term:{'status':'PENDING'}}];
    esGameService.searchGames(username, from, size, filters,
      function (error, data) {
        if(error){
          console.log(error);
          res.send(error);
        }else{
          res.set("username", username)
          res.send(data);
        }
      }
    );
  }else{
    res.render('login', {
      title: 'Stratio Ping-Pong Series'
    });
  }
});

router.post('/match/create', function (req, res, next) {
  var username = req.session.username
  if(username){
    var doc = buildMatchUpdateDoc(req, username)
    esGameService.createGame(doc,
      function(error, ok) {
        if(error){
          console.log(error);
          res.send(error);
        }else{
          console.log(ok);
          res.send(ok);
        }
      }
    );
  }else{
    res.render('login');
  }
});

router.post('/match/update', function (req, res, next) {
  var username = req.session.username
  if(username){
    var doc = buildMatchUpdateDoc(req, username)
    esGameService.updateGame(req.body.matchId, doc,
      function(error, ok) {
        if(error){
          console.log(error);
          res.send(error);
        }else{
          console.log(ok);
          res.send(ok);
        }
      }
    );
  }else{
    res.render('login');
  }
});

buildMatchUpdateDoc = function(req, username) {
  var winner = req.body.sets1 > req.body.sets2 ? req.body.player1 : req.body.player2
  var pendingBy = req.body.player1 === username ? req.body.player2 : req.body.player1
  var wonSets1 = 0
  var wonSets2 = 0

  for( var i = 0; i < req.body.points1.length; i++ ){
    if(req.body.points1[i] > req.body.points2[i]){
      wonSets1 += 1
    }else{
      wonSets2 += 1
    }
  }

  return {
    'matchType': req.body.matchType,
    'date': req.body.date,
    'winner': winner,
    'details': [
      {
        'player': req.body.player1,
        'wonSets': wonSets1,
        'points': req.body.points1
      },
      {
        'player': req.body.player2,
        'wonSets': wonSets2,
        'points': req.body.points2
      }
    ],
    'status': 'PENDING',
    'pendingBy' : pendingBy
  }
}

router.post('/match/confirm', function (req, res, next) {
  var username = req.session.username
  if(username){
    esGameService.confirmGame(req.body.matchId,
      function(error, ok) {
        if(error){
          console.log("ERROR: " + error);
          res.send(error);
        }else{
          console.log(ok);
          res.send("OK MSG: " + ok);
        }
      }
    );
  }else{
    res.render('login');
  }
});

router.post('/match/delete', function (req, res, next) {
  var username = req.session.username
  if(username){
    esGameService.deleteGame(req.body.matchId,
      function(error, ok) {
        if(error){
          console.log(error);
          res.send(error);
        }else{
          console.log(ok);
          res.send(ok);
        }
      }
    );
  }else{
    res.render('login');
  }
});