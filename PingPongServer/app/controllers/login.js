var express = require('express'),
  router = express.Router(),
  esService = require('../services/esService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/login', function (req, res, next) {
  var username = req.query.username;
  var password = req.query.password;
  console.log("Login: " + username + " - " + password);

  esService.getUser(username,
    function(error, user) {
      if(error){
        res.status(400).send('Wrong user');
      }else{
        if(typeof user === 'undefined'){
          console.log("User not found");
          res.status(400).send('Wrong user');
        }else if (user._source.password != password){
          console.log("Wrong password: " + password + " != " + user._source.password);
          res.status(400).send('Wrong password');
        }else{
          req.session.username = user._source.username
          req.session.fullname = user._source.fullname
          res.send(user._source.fullname);
        }
      }
    }
  );
});

router.get('/logout', function (req, res, next) {
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});