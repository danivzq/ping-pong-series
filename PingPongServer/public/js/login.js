logIn = function() {
  var jqxhr = $.get( "/login",
    {
      username: $("#login-form :input[name='username']").val(),
      password: CryptoJS.MD5($("#login-form :input[name='password']").val()).toString()
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

signUp = function() {
  $("#result").html("")

  var email = $("#signup-form :input[name='email']").val()
  var fullname = $("#signup-form :input[name='fullname']").val()
  var password = $("#signup-form :input[name='password']").val()
  var password2 = $("#signup-form :input[name='password2']").val()

  if(email === "" || fullname === "" || password === "" || password2 === ""
      || !isEmailValid(email) || !passwordsMatch(password,password2)){
    $("#result").html("Wrong input data")
    $("#result")[0].style.color = "#F00"
  }
  else{
    var jqxhr = $.post("/user/insert",
      {
        email: email,
        fullname: fullname,
        password: CryptoJS.MD5(password).toString()
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
}