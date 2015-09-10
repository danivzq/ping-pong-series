$(document).ready(function() {
  /*NAVIGATION EVENTS*/
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
    function(){
      loadResults(0, 20)
    }
  );

  /*RESULTS EVENTS*/
});

