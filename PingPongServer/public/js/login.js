logIn = function() {
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

signUpForm = function() {
  $("#login-form")[0].style.display = "none"
  $("#signup-form")[0].style.display = ""
}

logInForm = function() {
  $("#login-form")[0].style.display = ""
  $("#signup-form")[0].style.display = "none"
}

loadUser = function() {
  $("#signup-form :input[name='username']")[0].value = $("#signup-form :input[name='email']")[0].value.split("@")[0]
}

checkPassword = function() {
    var pass = $("#login-form :input[name='username']")[0]
    var pass2 = $("#newpassword2")[0]

    $("#newpassword2-error").html("")
    newpass2.style.borderColor = ""
    if(newpass.value !== newpass2.value){
        $("#newpassword2-error").html("New passwords must match")
        newpass2.style.borderColor = "#f00"
    }
}

signUp = function() {
  var jqxhr = $.post("/user/insert",
    {
      email: $("#signup-form :input[name='email']").val(),
      fullname: $("#signup-form :input[name='fullname']").val(),
      password: $("#signup-form :input[name='password']").val()
    })
    .done(function(data) {
      if(data.status === "400"){
        $("#result").html("Error, sign up cannot be done")
        $("#result")[0].style.color = "#F00"
      }else{
        $("#result").html("Sign up successful!")
        $("#result")[0].style.color = "#080"
      }
    })
    .fail(function(error) {
      $("#result").html(error.responseText)
      $("#result")[0].style.color = "#F00"
    });
}