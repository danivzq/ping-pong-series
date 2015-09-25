loadMatches = function(from, size, msgOK) {
  var jqxhr = $.get( "/matches",
    {
      from:from,
      size:size
    },
    function(data, status, request) {
      $("div#main-content").html("")
      $("div#main-content").append("<h1>MATCHES</h1>")
      var $matches = $("<div id='matches' class='results'/>" )
      $("div#main-content").append($matches)

      loadMatchesTable(data.hits, request.getResponseHeader("username"))
      if(data.hits.total > 20){
        loadMatchesPagination(data.hits.total, from)
      }
      if(msgOK){
        $("#result").html(msgOK)
        $("#result")[0].style.color = "#080"
      }
    })
    .fail(function(error) {
      $("#result").html(error.responseText);
      $("#result")[0].style.color = "#F00"
    });
}

/*MATCHES TABLE*/
loadMatchesTable = function(hits, username) {
  var $total = $("<p id='total'>Total: " + hits.total + "</p>")
  var matchestable =
    "<table id='matchestable'>" +
      "<thead>" +
        "<tr>" +
          "<th>Match Type</th>" +
          "<th>Game Type</th>" +
          "<th>Player 1</th>" +
          "<th>Score</th>" +
          "<th>Player 2</th>" +
          "<th>Date</th>" +
          "<th>Action</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>"
  for(var hit of hits.hits){
    matchestable +=
        "<tr id=" + hit._id + ">" +
          "<td>" +
            "<select name='matchType' value='" + hit._source.matchType + "'" +(hit._source.pendingBy!==username?'disabled':'')+ ">" +
              "<option value='SINGLES'>SINGLES</option>" +
              "<option value='DOUBLES'>DOUBLES</option>" +
            "</select>" +
          "</td>" +
          "<td>"+hit._source.gameType+"</td>" +
          "<td>" +
            "<input type='text' name='player1' value='" + hit._source.details[0].player + "'" +(hit._source.pendingBy!==username?'disabled':'')+ "/>" +
          "</td>" +
          "<td style='text-align:left;'>"
          for( var i = 0; i < hit._source.details[0].points.length; i++ ){
           matchestable +=
            "<div>" +
              "<input type='number' name='points1' min='0' max='50' value='" + hit._source.details[0].points[i] + "' " + (hit._source.pendingBy!==username?'disabled':'') +"/>" +
              " - " +
              "<input type='number' name='points2' min='0' max='50' value='" + hit._source.details[1].points[i] + "' " + (hit._source.pendingBy!==username?'disabled':'') +"/>" +
              "<img  " + (hit._source.pendingBy!==username?'style="display:none;"':'') + " id='deletescore' style='height:10px;' src='/img/x.png' title='Delete Score' onclick='deleteScore(this)'/>" +
            "</div>"
          }
          matchestable +=
          "<div " + (hit._source.pendingBy!==username?'style="display:none;"':'') + ">" +
            "<img id='addscore' class='black button' style='height:10px;' src='/img/more.png' title='AddScore'onclick='addScore(this.parentNode)'/>" +
          "</div>" +
          "</td>" +
          "<td>" +
            "<input type='text' name='player2' value='" + hit._source.details[1].player + "'" +(hit._source.pendingBy!==username?'disabled':'')+ "/>" +
          "</td>" +
          "<td>" +
            "<input type='date' name='date' value='" + hit._source.date +  "'" +(hit._source.pendingBy!==username?'disabled':'')+ "/>" +
          "</td>" +
          "<td>"
          if(hit._source.pendingBy !== username){
            matchestable +=
            "<div id='buttons'>" +
              "<img id='deletematch' class='black button' src='/img/delete.png' title='Delete' onclick='deleteMatch(\""+ hit._id +"\")'/>" +
            "</div>"
          }else{
            matchestable +=
            "<div id='buttons'>" +
              "<img id='editmatch' class='black button' src='/img/edit.png' title='Edit' onclick='editMatch(\""+ hit._id +"\")'/>" +
              "<img id='confirmmatch' class='black button' src='/img/confirm.png' title='Confirm' onclick='confirmMatch(\""+ hit._id +"\")'/>" +
            "</div>"
          }
    matchestable +=
            "<div id='waiting' style='display:none'>" +
              "<img src='/img/waiting.gif'/>" +
            "</div>"+
          "</td>" +
        "</tr>"
  }
  matchestable +=
        "<tr>" +
          "<td colspan='7'>" +
            "<div><img id='addmatch' class='black button' src='/img/add.png' title='Add' onclick='addMatch()'/></div>" +
          "</td>" +
        "</tr>"
      "</tbody></table>"
  var $smartpaginator = $("<div id='smart-paginator'>")
  var $result = $("<div id='result'/>" )
  $('div#matches').append($total, matchestable, $smartpaginator, $result)
}

addMatch = function() {
  var newMatch =
  "<tr id='newMatch'>" +
     "<td>" +
       "<select name='matchType' value='-1')>" +
         "<option disabled selected> -- select match type -- </option>" +
         "<option value='SINGLES'>SINGLES</option>" +
         "<option value='DOUBLES'>DOUBLES</option>" +
       "</select>" +
     "</td>" +
     "<td>training</td>" +
     "<td>" +
       "<input type='text' name='player1' placeholder='Player 1'/>" +
     "</td>" +
     "<td style='text-align:left;'>" +
       "<div>" +
         "<input type='number' name='points1' min='0' max='50' placeholder='0'/>" +
         " - " +
         "<input type='number' name='points2' min='0' max='50' placeholder='0'/>" +
       "</div>" +
       "<div><img id='addscore' class='black button' style='height:10px;' src='/img/more.png' title='AddScore'onclick='addScore(this.parentNode)'/></div>" +
     "</td>" +
     "<td>" +
       "<input type='text' name='player2' placeholder='Player 2'/>" +
     "</td>" +
     "<td>" +
       "<input type='date' name='date'/>" +
     "</td>" +
     "<td>" +
       "<div id='buttons'>" +
         "<img id='savematch' class='black button' src='/img/save.png' title='Save' onclick='saveMatch(\"newMatch\")'/>" +
       "</div>" +
       "<div id='waiting' style='display:none'>" +
         "<img src='/img/waiting.gif'/>" +
       "</div>"+
     "</td>" +
   "</tr>"

  $('#matchestable tr:last').before(newMatch)
  $('#addmatch')[0].style.display="none"
}

addScore = function(element) {
  var newScore =
    "<div>" +
      "<input type='number' name='points1' min='0' max='50' placeholder='0'/>" +
      " - " +
      "<input type='number' name='points2' min='0' max='50' placeholder='0'/>" +
      "<img id='deletescore' style='height:10px;' src='/img/x.png' title='Delete Score' onclick='deleteScore(this)'/>" +
    "</div>"
  element.innerHTML = newScore + element.outerHTML
}

deleteScore = function(element) {
  element.parentNode.innerHTML=""
}

isValidMatch = function(matchType, player1, player2, points1, points2, date) {
  var valid = true
  if(matchType === "" || player1 === ""  || player2 === "" || date === ""){
    valid = false;
  }
  for( var i = 0; i < points1.length; i++ ){
    if(points1[i] === "" || points2[i] === ""){
      valid = false;
    }
  }
  return valid;
}

saveMatch = function(matchId) {
  showWaitingIcon(matchId)

  var matchType = $("#" + matchId + " :input[name='matchType']").val()
  var player1 = $("#" + matchId + " :input[name='player1']").val()
  var player2 = $("#" + matchId + " :input[name='player2']").val()
  var points1Array = $("#" + matchId + " :input[name='points1']").toArray()
  var points2Array = $("#" + matchId + " :input[name='points2']").toArray()
  var points1 = []
  var points2 = []
  for ( var i = 0; i < points1Array.length; i++ ) {
    points1.push(points1Array[i].value);
    points2.push(points2Array[i].value);
  }
  var date = $("#" + matchId + " :input[name='date']").val()

  if(!isValidMatch(matchType, player1, player2, points1, points2, date)){
    showButtons(matchId)
    $("#result").html("Wrong input data")
    $("#result")[0].style.color = "#F00"
  }else{
    var jqxhr = $.post("/match/create",
      {
        matchType: matchType,
        player1: player1,
        player2: player2,
        points1: points1,
        points2: points2,
        date : date
      })
      .done(function(data) {
        if(data.status === "400"){
          $("#result").html("Error, changes are not applied")
          $("#result")[0].style.color = "#F00"
          showButtons(matchId)
        }else{
          setTimeout(function(){
            loadMatches(0, 20, "Match info saved, now your opponent has to confirm changes")
            $('#addmatch')[0].style.display=""
          },2000)
        }
      })
      .fail(function(error) {
        $("#result").html(error.responseText)
        $("#result")[0].style.color = "#F00"
        showButtons(matchId)
      });
  }
}

editMatch = function(matchId) {
  showWaitingIcon(matchId)

  var matchType = $("#" + matchId + " :input[name='matchType']").val()
    var player1 = $("#" + matchId + " :input[name='player1']").val()
    var player2 = $("#" + matchId + " :input[name='player2']").val()
    var points1Array = $("#" + matchId + " :input[name='points1']").toArray()
    var points2Array = $("#" + matchId + " :input[name='points2']").toArray()
    var points1 = []
    var points2 = []
    for ( var i = 0; i < points1Array.length; i++ ) {
      points1.push(points1Array[i].value);
      points2.push(points2Array[i].value);
    }
    var date = $("#" + matchId + " :input[name='date']").val()

  if(!isValidMatch(matchType, player1, player2, points1, points2, date)){
    showButtons(matchId)
    $("#result").html("Wrong input data")
    $("#result")[0].style.color = "#F00"
  }else{
    var jqxhr = $.post("/match/update",
      {
        matchId: matchId,
        matchType: matchType,
        player1: player1,
        player2: player2,
        points1: points1,
        points2: points2,
        date : date
      })
      .done(function(data) {
        if(data.status === "400"){
          $("#result").html("Error, changes are not applied")
          $("#result")[0].style.color = "#F00"
          showButtons(matchId)
        }else{
          setTimeout(function(){loadMatches(0, 20, "Match info updated, now your opponent has to confirm changes")},2000)
        }
      })
      .fail(function(error) {
        $("#result").html(error.responseText)
        $("#result")[0].style.color = "#F00"
        showButtons(matchId)
      });
  }
}

confirmMatch = function(matchId) {
    showWaitingIcon(matchId)

    var jqxhr = $.post("/match/confirm",
    {
      matchId: matchId
    })
    .done(function(data) {
      if(data.status === "400"){
        $("#result").html("Error, changes are not applied")
        $("#result")[0].style.color = "#F00"
        showButtons(matchId)
      }else{
        setTimeout(function(){loadMatches(0, 20, "Match confirmed, you can see it on results page")},2000)
      }
    })
    .fail(function(error) {
      $("#result").html(error.responseText)
      $("#result")[0].style.color = "#F00"
      showButtons(matchId)
    });
}

deleteMatch = function(matchId) {
  showWaitingIcon(matchId)

  var jqxhr = $.post("/match/delete",
  {
    matchId: matchId
  })
  .done(function(data) {
    if(data.status === "400"){
      $("#result").html("Error, changes are not applied")
      $("#result")[0].style.color = "#F00"
      showButtons(matchId)
    }else{
      setTimeout(function(){loadMatches(0, 20, "Match deleted")},2000)
    }
  })
  .fail(function(error) {
    $("#result").html(error.responseText)
    $("#result")[0].style.color = "#F00"
    showButtons(matchId)
  });
}

showWaitingIcon = function(matchId) {
  $("#" + matchId + " div#buttons")[0].style.display = "none"
  $("#" + matchId + " div#waiting")[0].style.display = ""
}

showButtons = function(matchId) {
  $("#" + matchId + " div#buttons")[0].style.display = ""
  $("#" + matchId + " div#waiting")[0].style.display = "none"
}

loadMatchesPagination = function(total, from) {
  $('#smart-paginator').smartpaginator({
    totalrecords: total,
    recordsperpage: 20,
    initval:(from/20)+1 ,
    next: 'Next',
    prev: 'Prev',
    first: 'First',
    last: 'Last',
    theme: 'black',
    onchange: function(newPageValue) {
      loadMatches((newPageValue-1)*20, 20)
    }
  })
}