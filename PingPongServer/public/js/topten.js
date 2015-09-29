loadTopTen = function() {
  var jqxhr = $.get( "/stats/topten",
    function(data, status, request) {
      var username = request.getResponseHeader("username")
      $("div#main-content").html("")
      $("div#main-content").append("<h1>TOP TEN</h1>")

      loadTopTenWins(data.aggregations.topwins, username)
      loadTopTenPoints(data.aggregations.toppoints, username)
      loadTopTenSets(data.aggregations.topsets, username)
    })
    .fail(function(error) {
      $("#result").html(error.responseText);
      $("#result")[0].style.color = "#F00"
    });
}

/*WINS TABLE*/
loadTopTenWins = function(agg, username) {
  var winstable =
  "<div class='topten'>"
  for(var i=0; i<2; i++){
    winstable +=
//        "<tr class='" + (agg.buckets[i].key === username ? 'bold-red' : '') + "' " +
//        "style='background-color:#47BAE6;opacity:" + (1 - ((i+1)*5)/100)+ "'>" +
//          "<td>" + (i+1) + "</td>" +
//          "<td>" + agg.buckets[i].key + "</td>" +
//          "<td>" + agg.buckets[i].doc_count + "</td>" +
//        "</tr>"
  }
  winstable +=
    "<table id='winstable'>" +
      "<thead>" +
        "<tr>" +
          "<th>Pos</th>" +
          "<th>Player</th>" +
          "<th>Wins</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>"

  for(var i=3; i<agg.buckets.length; i++){
    winstable +=
        "<tr class='" + (agg.buckets[i].key === username ? 'bold-red' : '') + "' " +
        "style='background-color:#47BAE6;opacity:" + (1 - ((i+1)*5)/100)+ "'>" +
          "<td>" + (i+1) + "</td>" +
          "<td>" + agg.buckets[i].key + "</td>" +
          "<td>" + agg.buckets[i].doc_count + "</td>" +
        "</tr>"
  }
  winstable +=
      "</tbody>" +
    "</table>" +
  "</div></br>"
  $("div#main-content").append(winstable)
}

/*POINTS TABLE*/
loadTopTenPoints = function(agg, username) {
  var pointstable =
  "<div class='topten'>" +
    "<table id='pointstable'>" +
      "<thead>" +
        "<tr>" +
          "<th>Pos</th>" +
          "<th>Player</th>" +
          "<th>Won Points</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>"

  var pos = 1
  for(var bucket of agg.user.buckets){
    pointstable +=
        "<tr class='" + (bucket.key === username ? 'bold-red' : 'stratio-color') + "' " +
        "style='background-color:#434343;opacity:" + (1 - (pos*5)/100)+ "'>" +
          "<td>" + pos + "</td>" +
          "<td>" + bucket.key + "</td>" +
          "<td>" + bucket.points.value + "</td>" +
        "</tr>"
    pos += 1
  }
  pointstable +=
      "</tbody>" +
    "</table>" +
  "</div>"
  $("div#main-content").append(pointstable)
}

/*SETS TABLE*/
loadTopTenSets = function(agg, username) {
  var setstable =
  "<div class='topten'>" +
    "<table id='setstable'>" +
      "<thead>" +
        "<tr>" +
          "<th>Pos</th>" +
          "<th>Player</th>" +
          "<th>Won Sets</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>"

  var pos = 1
  for(var bucket of agg.user.buckets){
    setstable +=
        "<tr class='" + (bucket.key === username ? 'bold-red' : 'stratio-color') + "' " +
        "style='background-color:#434343;opacity:" + (1 - (pos*5)/100)+ "'>" +
          "<td>" + pos + "</td>" +
          "<td>" + bucket.key + "</td>" +
          "<td>" + bucket.sets.value + "</td>" +
        "</tr>"
    pos += 1
  }
  setstable +=
      "</tbody>" +
    "</table>" +
  "</div>"
  $("div#main-content").append(setstable)
}