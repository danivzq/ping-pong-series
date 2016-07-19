checkEmail = function(email, error) {
    error.html("")
    email.style.borderColor = ""
    if(!isEmailValid(email.value)){
        error.html("Invalid email address")
        email.style.borderColor = "#f00"
    }
}

isEmailValid = function(email){
    var re = /\S+@\S+\.\S+/
    return re.test(email)
}

checkPasswords = function(pass1, pass2, error) {
    error.html("")
    pass2.style.borderColor = ""
    if(!passwordsMatch(pass1.value, pass2.value)){
        error.html("New passwords must match")
        pass2.style.borderColor = "#f00"
    }
}

passwordsMatch = function(pass1, pass2){
    return pass1 === pass2
}