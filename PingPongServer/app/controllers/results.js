var express = require('express'),
  router = express.Router(),
  esGameService = require('../services/esGameService');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/results', function (req, res, next) {
  var username = req.session.username
  if(username){
    var from = req.query.from;
    var size = req.query.size;
    var filters = buildFilters(req.query.filters, username);
    var sort = buildSort(req.query.sort);
    esGameService.searchGames(username, from, size, filters, sort,
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

buildFilters = function(filters, username){
  var esFilters = [];
  for(var i in filters){
    var f = filters[i]
    esFilters.push({bool:{should:[]}});
    console.log(esFilters[0])
    if(f.field === "winner" && f.value === "victories"){
      esFilters[0].bool.should.push({term: {'winner' : username } });
    }else if(f.field === "winner" && f.value === "defeats"){
      esFilters[0].bool.should.push({bool: {must_not: {term: {'winner': username } } } });
    }else{
      var termFilter = {term:{}};
      termFilter.term[f.field] = f.value;
      esFilters.push(termFilter);
    }
  }
  esFilters.push({term:{'status':'CONFIRMED'}});
  return esFilters;
}

buildSort = function(sort){
  var esSorts = [];
  for(var i in sort){
    var s = sort[i];
    var esSort = {};
    esSort[s.field] = s.value;
    esSorts.push(esSort)
  }
  return esSorts;
}
