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
  $( "#nav-matches" ).click(
    function(){
      cleanSelectedNavigation()
      $("#nav-matches")[0].className = "selected"
      loadMatches(0, 20)
    }
  );
  $( "#nav-results" ).click(
    function(){
      cleanSelectedNavigation()
      $("#nav-results")[0].className = "selected"
      loadResults(0, 20)
    }
  );
  $( "#nav-topten" ).click(
    function(){
      cleanSelectedNavigation()
      $("#nav-topten")[0].className = "selected"
      loadTopTen()
    }
  );
   $( "#logout" ).click(
      function(){
        $(location).attr('href', '/logout')
      }
    );

  /*HOME EVENTS*/
  $( "#pass-change" ).click(
    function(){
      showChangePasswordInputs()
    }
  );

});

cleanSelectedNavigation = function() {
  $("#nav-home")[0].className = ""
  $("#nav-matches")[0].className = ""
  $("#nav-results")[0].className = ""
  $("#nav-topten")[0].className = ""
}