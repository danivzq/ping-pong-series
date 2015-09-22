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
  var pass
  if($("#pass-change")[0].checked){
    pass = $("#home-form :input[name='newpassword']").val()
  }else{
    pass = $("#home-form :input[name='password']").val()
  }
  var jqxhr = $.post("/user/update",
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