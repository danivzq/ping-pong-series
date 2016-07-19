loadTopTen = function(matchType) {
  var jqxhr = $.get( "/stats/topten",
    {
      matchType: matchType
    },
    function(data, status, request) {
      var username = request.getResponseHeader("username")
      $("div#main-content").html("")
      $("div#main-content").append("<h1>TOP TEN</h1>")

      var matchTypeFilter =
        "<div id='aggs' class='aggs'>" +
          "<div class='agg'>" +
            "<p>MATCH TYPE</p>" +
            "<table>" +
              "<tr>" +
                "<td>" +
                  "<select name='matchType'>" +
                    "<option value='SINGLES'" + (matchType === "SINGLES" ? 'selected' : '') + ">SINGLES</option>" +
                    "<option value='DOUBLES'" + (matchType === "DOUBLES" ? 'selected' : '') + ">DOUBLES</option>" +
                  "</select>" +
                "</td>" +
              "</tr>" +
            "</table>" +
          "</div>" +
        "</div>"
      $("div#main-content").append(matchTypeFilter)
      $("#aggs").find("select").change(
        function(){
          loadTopTen($("#aggs :input[name='matchType']").val())
        }
      );

      loadTopTenWins(data.aggregations.topwins, username)
      loadTopTenPoints(data.aggregations.toppoints, username)
      loadTopTenSets(data.aggregations.topsets, username)

      $("div#main-content").append("<div><p id='result'></p></div>")
    })
    .fail(function(error) {
      $("#result").html(error.responseText);
      $("#result")[0].style.color = "#F00"
    });
}

/*WINS TABLE*/
loadTopTenWins = function(agg, username) {
  var winstable =
    "<div class='topten-block'>" +
      "<div class='podium'>"
  for(var i=0; i<=2; i++){
    winstable +=
        "<div class='" + (agg.buckets[i].key === username ? 'bold-red' : '') + " medal" + (i+1) +"'>" +
          "<p><b>" + agg.buckets[i].key + "</b></p>" +
          "<p>" + agg.buckets[i].doc_count + " wins</p>" +
        "</div>"
  }
  winstable +=
  "</div>" +
  "<div class='topten'>" +
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
        "style='background-color:#47BAE6;opacity:" + (1.2 - ((i+1)*7)/100)+ "'>" +
          "<td>" + (i+1) + "</td>" +
          "<td>" + agg.buckets[i].key + "</td>" +
          "<td>" + agg.buckets[i].doc_count + "</td>" +
        "</tr>"
  }
  winstable +=
      "</tbody>" +
    "</table></div></div>"+
    "<div id='toptenextra' class='topten-block'></div>"
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
        "<tr class='" + (bucket.key === username ? 'bold-red' : 'color-white') + "' " +
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
  $("div#toptenextra").append(pointstable)
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
        "<tr class='" + (bucket.key === username ? 'bold-red' : 'color-white') + "' " +
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
  $("div#toptenextra").append(setstable)
}