checkEmail = function(email, error) {
    var re = /\S+@\S+\.\S+/;

    error.html("")
    email.style.borderColor = ""
    if(!re.test(email.value)){
        error.html("Invalid email address")
        email.style.borderColor = "#f00"
    }
}

checkPasswords = function(pass1, pass2, error) {
    error.html("")
    pass2.style.borderColor = ""
    if(pass1.value !== pass2.value){
        error.html("New passwords must match")
        pass2.style.borderColor = "#f00"
    }
}