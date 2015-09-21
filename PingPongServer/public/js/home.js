showChangePasswordInputs = function() {
    if($("#pass-change")[0].checked){
        $("#password-change")[0].style.display = ""
    }else{
        $("#password-change")[0].style.display = "none"
    }
}

checkEmail = function() {
    var re = /\S+@\S+\.\S+/;
    var email = $("#email")[0]

    $("#email-error").html("")
    email.style.borderColor = ""
    if(!re.test(email.value)){
        $("#email-error").html("Invalid email address")
        email.style.borderColor = "#f00"
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

checkNewPassword = function() {
    var newpass = $("#newpassword")[0]
    var newpass2 = $("#newpassword2")[0]

    $("#newpassword2-error").html("")
    newpass2.style.borderColor = ""
    if(newpass.value !== newpass2.value){
        $("#newpassword2-error").html("New passwords must match")
        newpass2.style.borderColor = "#f00"
    }
}

applyChanges = function() {
  var pass
  if($("#pass-change")[0].checked){
    pass = $("#home-form :input[name='newpassword']").val()
  }else{
    pass = $("#home-form :input[name='password']").val()
  }
  var jqxhr = $.post("/user/upsert",
    {
      email: $("#home-form :input[name='email']").val(),
      fullname: $("#home-form :input[name='fullname']").val(),
      password: pass
    })
    .done(function(data) {
      if(data.status === "400"){
        $("#changeResult").html("Error, changes are not applied")
        $("#changeResult")[0].style.color = "#F00"
      }else{
        $("#changeResult").html("Changes applied succesfully")
        $("#changeResult")[0].style.color = "#080"
      }
    })
    .fail(function(error) {
      $("#changeResult").html(error.responseText)
      $("#changeResult")[0].style.color = "#F00"
    });
}