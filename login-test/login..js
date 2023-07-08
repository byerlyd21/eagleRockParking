const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register");

loginBtn.addEventListener("click", (e) => {

    if (userId.value === "DByerly" && password.value === "1234") {
        window.location.href = "../src/StorageUnit.html"
        e.preventDefault();
    }
});

registerBtn.addEventListener("click", registerUser);
console.log("hi");

const userId = document.getElementById("user-id")
const password = document.getElementById("password")


function registerUser() {

}