var express = require('express'),
  router = express.Router();

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  if(req.session.username){
    res.render('player/home', {
      fullname: req.session.fullname
    });
  }else{
    res.render('login');
  }
});
