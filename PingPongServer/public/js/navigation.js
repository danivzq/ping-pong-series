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
      $("#nav-results")[0].className = "selected"
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