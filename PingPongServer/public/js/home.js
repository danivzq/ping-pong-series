showChangePasswordInputs = function() {
    if($("#pass-change")[0].checked){
        $("#password-change")[0].style.display = ""
    }else{
        $("#password-change")[0].style.display = "none"
    }
}

checkOldPassword = function() {
    var pass = $("#password")[0]
    var oldpass = $("#oldpassword")[0]

    $("#oldpassword-error").html("")
    oldpass.style.borderColor = ""
    if(pass.value !== oldpass.value){
        $("#oldpassword-error").html("Wrong password")
        oldpass.style.borderColor = "#f00"
    }
}

applyChanges = function() {
  var email = $("#home-form :input[name='email']").val()
  var fullname = $("#home-form :input[name='fullname']").val()
  var password = $("#home-form :input[name='password']").val()
  var oldpassword = $("#home-form :input[name='oldpassword']").val()
  var newpassword = $("#home-form :input[name='newpassword']").val()
  var newpassword2 = $("#home-form :input[name='newpassword2']").val()

  if(email === "" || fullname === "" || !isEmailValid(email)){
    $("#result").html("Wrong input data")
    $("#result")[0].style.color = "#F00"
  }
  else if($("#pass-change")[0].checked &&
      (oldpassword === "" || newpassword === "" || newpassword2 === ""
      || !passwordsMatch(password,oldpassword) || !passwordsMatch(newpassword,newpassword2))){
    $("#result").html("Wrong input data")
    $("#result")[0].style.color = "#F00"
  }else {
    var pass
    if($("#pass-change")[0].checked){
      pass = $("#home-form :input[name='newpassword']").val()
    }else{
      pass = $("#home-form :input[name='password']").val()
    }
    var jqxhr = $.post("/user/update",
      {
        email: email,
        fullname: fullname,
        password: pass
      })
      .done(function(data) {
        if(data.status === "400"){
          $("#result").html("Error, changes are not applied")
          $("#result")[0].style.color = "#F00"
        }else{
          $("#result").html("Changes applied succesfully")
          $("#result")[0].style.color = "#080"
        }
      })
      .fail(function(error) {
        $("#result").html(error.responseText)
        $("#result")[0].style.color = "#F00"
      });
  }
}