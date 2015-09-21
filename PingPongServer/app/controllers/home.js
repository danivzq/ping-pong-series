var express = require('express'),
  router = express.Router()
  esService = require('../services/esService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  if(req.session.username){
    esService.getUser(req.session.username,
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

router.post('/user/upsert', function (req, res, next) {
  if(req.session.username){
    var email = req.body.email;
    var fullname = req.body.fullname;
    var password = req.body.password;
    esService.upsertUser(email, fullname, password,
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
