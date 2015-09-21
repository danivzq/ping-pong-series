signIn = function() {
  var jqxhr = $.get( "/login",
    {
      username:$("#login-form :input[name='username']").val(),
      password:$("#login-form :input[name='password']").val()
    })
    .done(function(data) {
      $(location).attr('href', '/')
    })
    .fail(function(error) {
      $("#login-error").html(error.responseText)
    });
}