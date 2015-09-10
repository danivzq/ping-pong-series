loadResults = function(from, size, filters) {
  var jqxhr = $.get( "/results",
    {
      from:from,
      size:size,
      filters: filters
    },
    function(data, status, request) {
      $("div#main-content").html("")
      $("div#main-content").append("<h1>RESULTS</h1>")
      var $aggs = $("<div id='aggs' class='aggs'/>" )
      var $results = $("<div id='results' class='results'/>" )
      var $error = $("<div id='error' class='error'/>" )
      $("div#main-content").append($aggs, $results, $error)

      loadAggs(data.aggregations)
      checkUsedFilters(filters)
      loadResultsTable(data.hits, request.getResponseHeader("username"))
      if(data.hits.total > 20){
        loadPagination(data.hits.total, from)
      }
    })
    .fail(function(error) {
      $("#error").html(error.responseText);
    });
}

/*AGGREGATIONS*/
loadAggs = function(aggs) {
  var aggsHtml =
    "<div class='agg'>" +
      "<p>WINNER</p>"
  if(aggs.victories.doc_count > 0){
    aggsHtml +=
      "<div>" +
          "<input id='victories' type='checkbox'/>" +
          "<label for='victories'>Victory ("+aggs.victories.doc_count+")</label>" +
      "</div>"
  }
  if(aggs.defeats.doc_count > 0){
      aggsHtml +=
      "<div>" +
          "<input id='defeats' type='checkbox'/>" +
          "<label for='defeats'>Defeat ("+aggs.defeats.doc_count+")</label>" +
      "</div>"
  }
  aggsHtml += "</div>"
  $('div#aggs').html(aggsHtml)
  loadDinamicAgg(aggs.matchType.buckets, "MATCH TYPE", "matchType")
  loadDinamicAgg(aggs.gameType.buckets, "GAME TYPE", "gameType")
  $("#aggs").find("input").change(
    function(){
      filterResults($("#aggs").find("input"))
    }
  );
}
loadDinamicAgg = function(buckets, title, name){
  if(buckets.length > 0){
    var agg ="<div class='agg'><p>"+title+"</p>"
    for(var bucket of buckets){
      agg +=
      "<div>" +
        "<input id='"+bucket.key+"' name='"+name+"' type='checkbox'/>" +
        "<label for='"+bucket.key+"'>"+bucket.key+" ("+bucket.doc_count+")</label>" +
      "</div>"
    }
    agg += "</div>"
    $('div#aggs').append(agg)
  }
}
checkUsedFilters = function(filters) {
  if(filters !== undefined){
    for(var filter of filters){
      $("#"+filter.value).prop('checked', true);
    }
  }
}
filterResults = function(inputs) {
  var filters = [];
  for(var i in inputs){
    if(inputs[i].checked){
      if(inputs[i].id === "victories" || inputs[i].id === "defeats"){
        filters.push({field:"winner", value:inputs[i].id})
      }else{
        filters.push({field:inputs[i].name, value:inputs[i].id})
      }
    }
  }
  loadResults(0, 20, filters);
}

/*RESULTS TABLE*/
loadResultsTable = function(hits, username) {
  var $total = $("<p id='total'>Total: " + hits.total + "</p>")
  var resultstable =
    "<table id='resultstable'>" +
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
  for(var hit of hits.hits){
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
  resultstable += "</tbody></table>"
  var $smartpaginator = $("<div id='smart-paginator'>")
  $('div#results').append($total, resultstable, $smartpaginator)
}

/*PAGINATION*/
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
