const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register");

loginBtn.addEventListener("click", loginUser);
registerBtn.addEventListener("click", registerUser);
console.log("hi");

const userId = document.getElementById("user-id")
const password = document.getElementById("password")

function loginUser() {

    console.log(userId.value, password.value)

}

function registerUser() {

}