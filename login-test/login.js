
//----------

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "eagle-rock-parking.firebaseapp.com",
  databaseURL: "https://eagle-rock-parking-default-rtdb.firebaseio.com",
  projectId: "eagle-rock-parking",
  storageBucket: "eagle-rock-parking.appspot.com",
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.G-MEASUREMENT_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

// Login  --------------------------------------

const userId = document.getElementById("user-id")
const password = document.getElementById("password")
const email = document.getElementById("email")

const loginBtn = document.getElementById("login-btn");

// Register --------------------------------------

const registerLocation = document.getElementById("register-location")
const registerEmail = document.getElementById("register-email")
const registerUserId = document.getElementById("register-user-id")
const registerPassword = document.getElementById("register-password")

const registerBtn = document.getElementById("register");

function validation() {
    console.log("validating");
    let nameregx = /^[a-zA-Z]+$/;
    let email = /^[a-zA-Z0-9]+@\.(gmail|yahoo|outlook)\.com$/;
    let userregx = /^[a-zA-Z0-9]{5,}$/;
    
    if (!nameregx.test(registerLocation.value)) {
        alert("The name should only contain letters");
        return false;
    }
    if (!email.test(registerEmail.value)) {
        alert("Enter valid email");
        return false;
    }
    if (!userregx.test(registerUserId.value)) {
        alert("-username can only be alphanumeric\n-username must be at least 5 characters\n-username cannot contain spaces");
        return false;
    }

    return true;
}

function registerUser() {
    console.log("regersting");
    if (!validation()) {
        return;
    };
    const dbRef = ref(database);

    get(child(dbRef, "userList/"+registerUserId.value)).then((snapshot)=>{
        if (snapshot.exists()) {
            alert("Account already exists")
        }
        else {
            set(ref(database, "userList"+ registerUserId.value),
            {
                fullname: registerLocation.value,
                email: registerEmail.value,
                username: registerUserId.value,
                password: registerPassword.value
            })
            .then(()=> {
                alert("User added successfully");
            })
            .catch((error)=> {
                alert("alert"+error);
            })
        }
    })
}

registerBtn.addEventListener("click", registerUser);

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

loginBtn.addEventListener("click", (e) => {

    if (userId.value === "DByerly" && password.value === "1234") {
        window.location.href = "../src/StorageUnit.html"
        e.preventDefault();
    }
});


