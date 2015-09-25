loadResults = function(from, size, filters, sort) {
  var jqxhr = $.get( "/results",
    {
      from:from,
      size:size,
      filters: filters,
      sort: sort
    },
    function(data, status, request) {
      $("div#main-content").html("")
      $("div#main-content").append("<h1>RESULTS</h1>")
      var $aggs = $("<div id='aggs' class='aggs'/>" )
      var $results = $("<div id='results' class='results'/>" )
      var $error = $("<div id='error' class='error'/>" )
      $("div#main-content").append($aggs, $results, $error)

      loadAggs(data.aggregations, filters && filters.length > 0)
      checkUsedFilters(filters)

      loadResultsTable(data.hits, request.getResponseHeader("username"))
      checkUsedSort(sort)

      if(data.hits.total > 20){
        loadResultsPagination(data.hits.total, from)
      }
    })
    .fail(function(error) {
      $("#error").html(error.responseText);
    });
}

/*AGGREGATIONS*/
loadAggs = function(aggs, isSomeFilterSelected) {
  var aggsHtml = ""
  if(aggs.victories.doc_count > 0 || aggs.defeats.doc_count > 0){
    aggsHtml += "<div class='agg'>"
    aggsHtml += "<p>WINNER</p>"
    if(aggs.victories.doc_count > 0){
      aggsHtml +=
        "<div>" +
            "<input class='checkbox' id='victories' type='checkbox'/>" +
            "<label class='checkbox' for='victories'>Victory ("+aggs.victories.doc_count+")</label>" +
        "</div>"
    }
    if(aggs.defeats.doc_count > 0){
        aggsHtml +=
        "<div>" +
            "<input class='checkbox' id='defeats' type='checkbox'/>" +
            "<label class='checkbox' for='defeats'>Defeat ("+aggs.defeats.doc_count+")</label>" +
        "</div>"
    }
    aggsHtml += "</div>"
  }

  $('div#aggs').html(aggsHtml)
  loadDinamicAgg(aggs.matchType.buckets, "MATCH TYPE", "matchType")
  loadDinamicAgg(aggs.gameType.buckets, "GAME TYPE", "gameType")

  $('div#aggs').append(
          "<div id='clean' class='agg' style='text-align:center;padding:5px;display:" +
          (isSomeFilterSelected ? '' : 'none')+ "'>" +
            "<img class='black button' src='/img/clean.png' onclick='cleanFilters(this.parentNode)'>" +
          "</div>")

  $("#aggs").find("input").change(
    function(){
      loadResults(0, 20, getFilters(), getSort())
    }
  );
}
loadDinamicAgg = function(buckets, title, name){
  if(buckets.length > 0){
    var agg ="<div class='agg'><p>"+title+"</p>"
    for(var bucket of buckets){
      agg +=
      "<div>" +
        "<input class='checkbox' id='"+bucket.key+"' name='"+name+"' type='checkbox'/>" +
        "<label class='checkbox' for='"+bucket.key+"'>"+bucket.key+" ("+bucket.doc_count+")</label>" +
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
checkUsedSort = function(sort) {
  if(sort !== undefined){
    for(var s of sort){
      if(s.value === "desc"){
        $("#"+s.field+"_desc_sort")[0].style.display = ""
        $("#"+s.field+"_asc_sort")[0].style.display = "none"
      }else {
        $("#"+s.field+"_desc_sort")[0].style.display = "none"
        $("#"+s.field+"_asc_sort")[0].style.display = ""
      }
    }
  }
}
cleanFilters = function(cleanButtonDiv){
  var inputs = $("#aggs").find("input")
  for(var i in inputs){
    inputs[i].checked = false
  }
  loadResults(0, 20, getFilters(), getSort())
}

getFilters = function() {
  var filters = [];

  var inputs = $("#aggs").find("input")
  for(var i in inputs){
    if(inputs[i].checked){
      if(inputs[i].id === "victories" || inputs[i].id === "defeats"){
        filters.push({field:"winner", value:inputs[i].id})
      }else{
        filters.push({field:inputs[i].name, value:inputs[i].id})
      }
    }
  }

  return filters
}

getSort = function() {
  if($("#date_desc_sort")[0].style.display === ""){
    return [{field : 'date', value : 'desc'}]
  }else{
    return [{field : 'date', value : 'asc'}]
  }
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
          "<th class='clickable' onclick='sortResults(this)'>" +
            "Date" +
            "<img id='date_desc_sort' src='/img/sort_desc.png' style='float:right'/>" +
            "<img id='date_asc_sort' src='/img/sort_asc.png' style='float:right;display:none'/>" +
          "</th>" +
        "</tr>" +
      "</thead>" +
      "<tbody>"
  for(var hit of hits.hits){
    resultstable +=
        "<tr class="+(hit._source.winner.indexOf(username) > -1 ? 'victory' : 'defeat')+
        " onclick='showDetails(this)'>" +
          "<td>"+hit._source.matchType+"</td>" +
          "<td>"+hit._source.gameType+"</td>" +
          "<td class="+(hit._source.details[0].player === hit._source.winner ? 'winner' : '')+">"+hit._source.details[0].player+"</td>" +
          "<td>"+hit._source.details[0].wonSets+" - "+hit._source.details[1].wonSets+"</td>" +
          "<td class="+(hit._source.details[1].player === hit._source.winner ? 'winner' : '')+">"+hit._source.details[1].player+"</td>" +
          "<td>"+hit._source.date+"</td>" +
        "</tr>" +
        "<tr style='display:none'>" +
          "<td></td><td></td><td>"
    for(var i = 0; i < hit._source.details[0].points.length; i++){
      var point = parseInt(hit._source.details[0].points[i])
      if(point > hit._source.details[1].points[i]){
        resultstable += "<b>" + point + "</b></br>"
      }else{
        resultstable += point + "</br>"
      }
    }
    resultstable +=
          "</td><td>-</td><td>"
    for(var i = 0; i < hit._source.details[1].points.length; i++){
      var point = parseInt(hit._source.details[1].points[i])
      if(point > hit._source.details[0].points[i]){
        resultstable += "<b>" + point + "</b></br>"
      }else{
        resultstable += point + "</br>"
      }
    }
    resultstable +=
          "</td><td></td>" +
        "</tr>"
  }
  resultstable += "</tbody></table>"
  var $smartpaginator = $("<div id='smart-paginator'>")
  $('div#results').append($total, resultstable, $smartpaginator)
}

sortResults = function(element) {
  if(element.firstElementChild.style.display == ""){
    element.firstElementChild.style.display = "none"
    element.firstElementChild.nextSibling.style.display = ""
  }else{
    element.firstElementChild.style.display = ""
    element.firstElementChild.nextSibling.style.display = "none"
  }

  loadResults(0, 20, getFilters(), getSort())
}

showDetails = function(element) {
  if(element.nextSibling.style.display == "none"){
    element.nextSibling.style.display=""
  }else{
    element.nextSibling.style.display="none"
  }
}

loadResultsPagination = function(total, from) {
  $('#smart-paginator').smartpaginator({
    totalrecords: total,
    recordsperpage: 20,
    initval:(from/20)+1 ,
    next: 'Next',
    prev: 'Prev',
    first: 'First',
    last: 'Last',
    theme: 'black',
    onchange: function(newPageValue){
      loadResults((newPageValue-1)*20, 20, getFilters(), getSort())
    }
  })
}