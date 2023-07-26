
//----------

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
// import { initializeApp } from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { getDatabase, ref, set, child, get } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBCwWpAc4IndijYAxoSE5LDMy4orL__AE8",
    authDomain: "eagle-rock-parking.firebaseapp.com",
    databaseURL: "https://eagle-rock-parking-default-rtdb.firebaseio.com",
    projectId: "eagle-rock-parking",
    storageBucket: "eagle-rock-parking.appspot.com",
    messagingSenderId: "123297692040",
    appId: "1:123297692040:web:a013be1a203965a2e6e23d",
    measurementId: "G-Y68B995K83"
};



const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);


// Detect auth state

onAuthStateChanged(auth, (user)=> {
    if (!user == null) {
        console.log("logged in!")
    } else {
        console.log("no user")
    }
});

// Login  --------------------------------------

const userId = document.getElementById("user-id")
const password = document.getElementById("password")

const loginBtn = document.getElementById("login-btn");


loginBtn.addEventListener("click", (e) => {
    e.preventDefault()
    authenticateUser();
});

function authenticateUser() {
    const dbRef = ref(database);
    console.log("A");
    get(child(dbRef, "userList/"+userId.value)).then((snapshot)=>{
        console.log("B");
        if (snapshot.exists()) {
            let dbpass = snapshot.val().password;
            if (dbpass == password.value) {
                login();
            } else {
                alert("password is incorrect")
            }
        } else {
            alert("User does not exist")
        }
    });
}



// Register --------------------------------------

const registerLocation = document.getElementById("register-location")
const registerEmail = document.getElementById("register-email")
const registerUserId = document.getElementById("register-user-id")
const registerPassword = document.getElementById("register-password")

const registerBtn = document.getElementById("register");

function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function validation() {
    console.log("validating");
    let nameregx = /^[a-zA-Z]+$/;
    let email = /^[a-zA-Z0-9]+@\.(gmail|yahoo|outlook)\.com$/;
    let userregx = /^[a-zA-Z0-9]{5,}$/;
    
    console.log(registerLocation)
    if (isEmptyOrSpaces(registerLocation) || isEmptyOrSpaces(registerEmail) || isEmptyOrSpaces(registerUserId) || isEmptyOrSpaces(registerPassword.value )) {
        alert("All fields must be completed");
        return false;
    }

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
    console.log("true")
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

registerBtn.addEventListener("click", (e)=> {
    e.preventDefault()
    registerUser()
});

// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }



