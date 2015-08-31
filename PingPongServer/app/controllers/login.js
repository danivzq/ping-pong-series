var express = require('express'),
  router = express.Router(),
  esService = require('../services/esService');

module.exports = function (app) {
  app.use('/', router);
};

router.post('/login', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  console.log("Login: " + username + " - " + password);

  esService.getUser(username,
    function(error, user) {
      if(error){
        res.render('login', {
          errorMessage: 'Wrong user'
        });
      }else{
        if(typeof user === 'undefined'){
          console.log("User not found");
          res.render('login', {
            errorMessage: 'Wrong user'
          });
        }else if (user._source.password != password){
          console.log("Wrong password: " + password + " != " + user._source.password);
          res.render('login', {
            errorMessage: 'Wrong password'
          });
        }else{
          req.session.username = user._source.username
          req.session.fullname = user._source.fullname
          res.render('player/home', {
            fullname: req.session.fullname
          });
        }
      }
    }
  );
});
