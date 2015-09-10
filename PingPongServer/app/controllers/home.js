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
          res.render('main', {user : user});
        }
      }
    );
  }else{
    res.render('login');
  }
});
