loadResults = function(from, size) {
  var jqxhr = $.get( "/results",
    {
      from:from,
      size:size
    },
    function(data, status, request) {
      $("h1").html("RESULTS")
      $("div#results").css("display", "block")
      $('p#total').html("Total: " + data.hits.total)
      loadAggs(data.aggregations)
      loadResultsTable(data.hits.hits, request.getResponseHeader("username"))
      if(data.hits.total > 20){
        loadPagination(data.hits.total, from)
      }
    })
    .fail(function(error) {
      $("#error").html(error.responseText);
    });
}

loadAggs = function(aggs) {
  $('div#aggs').html(
    "<div class='agg'>" +
      "<p>WINNER</p>" +
      "<div>" +
          "<input id='victories' type='checkbox'/>" +
          "<label for='victories'>Victory ("+aggs.victories.doc_count+")</label>" +
      "</div>"+
      "<div>" +
          "<input id='defeats' type='checkbox'/>" +
          "<label for='defeats'>Defeat ("+aggs.defeats.doc_count+")</label>" +
      "</div>" +
    "</div>")
  loadDinamicAgg(aggs.matchType.buckets, "MATCH TYPE")
  loadDinamicAgg(aggs.gameType.buckets, "GAME TYPE")
}

loadDinamicAgg = function(buckets, title){
  if(buckets.length > 0){
    var agg ="<div class='agg'><p>"+title+"</p>"
    for(var bucket of buckets){
      agg +=
      "<div>" +
        "<input id='"+bucket.key+"' type='checkbox'/>" +
        "<label for='"+bucket.key+"'>"+bucket.key+" ("+bucket.doc_count+")</label>" +
      "</div>"
    }
    agg += "</div>"
    $('div#aggs').append(agg)
  }
}

loadResultsTable = function(hits, username) {
  var resultstable =
    "<thead>" +
      "<tr>" +
        "<th>Match Type</th>" +
        "<th>Game Type</th>" +
        "<th>Player 1</th>" +
        "<th>Score</th>" +
        "<th>Player 2</th>" +
        "<th>Date</th>" +
      "</tr>" +
    "</thead>" +
    "<tbody>"
  for(var hit of hits){
    resultstable +=
    "<tr class="+(hit._source.winner === username ? 'victory' : 'defeat')+">" +
      "<td>"+hit._source.matchType+"</td>" +
      "<td>"+hit._source.gameType+"</td>" +
      "<td class="+(hit._source.details[0].player === hit._source.winner ? 'winner' : '')+">"+hit._source.details[0].player+"</td>" +
      "<td>"+hit._source.details[0].wonSets+" - "+hit._source.details[1].wonSets+"</td>" +
      "<td class="+(hit._source.details[1].player === hit._source.winner ? 'winner' : '')+">"+hit._source.details[1].player+"</td>" +
      "<td>"+hit._source.date+"</td>" +
    "</tr>"
  }
  resultstable += "</tbody>"
  $('table#resultstable').html(resultstable)
}

loadPagination = function(total, from) {
  $('#smart-paginator').smartpaginator({
    totalrecords: total,
    recordsperpage: 20,
    initval:(from/20)+1 ,
    next: 'Next',
    prev: 'Prev',
    first: 'First',
    last: 'Last',
    theme: 'black',
    onchange: onChange
  })
}

function onChange(newPageValue) {
  loadResults((newPageValue-1)*20, 20)
}
