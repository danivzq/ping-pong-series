var express = require('express'),
  router = express.Router()
  esUserService = require('../services/esUserService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  if(req.session.username){
    esUserService.getUser(req.session.username,
      function(error, user) {
        if(error){
          console.log(error);
          res.render('main', error);
        }else{
          console.log(user);
          res.render('main', user._source);
        }
      }
    );
  }else{
    res.render('login');
  }
});

router.post('/user/insert', function (req, res, next) {
  var email = req.body.email;
  var fullname = req.body.fullname;
  var password = req.body.password;
  esUserService.insertUser(email, fullname, password,
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
});

router.post('/user/update', function (req, res, next) {
  if(req.session.username){
    var email = req.body.email;
    var fullname = req.body.fullname;
    var password = req.body.password;
    esUserService.updateUser(email, fullname, password,
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