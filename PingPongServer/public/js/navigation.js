$(document).ready(function() {
  $( "#nav-home" ).click(
    function() {
      $(location).attr('href', '/');
    }
  );
  $( "#nav-stats" ).click(
    function() {
      $(location).attr('href', '/');
    }
  );
  $( "#nav-results" ).click(
    function() {
      var jqxhr = $.get( "/results",
        {
          from:0,
          size:20
        })
        .done(function(data) {
          $("h1").html("RESULTS");
          $("div#results").css("display", "block");
          $('div#aggs').html(
            "<div class='agg'>" +
              "<p>WINNER</p>" +
                "<div>" +
                    "<input id='victories' type='checkbox'/>" +
                    "<label for='victories'>Victory ("+data.aggregations.victories.doc_count+")</label>" +
                "</div>"+
                "<div>" +
                    "<input id='defeats' type='checkbox'/>" +
                    "<label for='defeats'>Defeat ("+data.aggregations.defeats.doc_count+")</label>" +
                "</div>" +
            "</div>");
          

        })
        .fail(function(error) {
          $("#error").html(error.responseText);
        });
    }
  );
});

