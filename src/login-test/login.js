
//----------

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
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

const loginBtn = document.getElementById("login-btn");


loginBtn.addEventListener("click", (e) => {
    const userId = document.getElementById("user-id");
    const password = document.getElementById("password");
    const email = document.getElementById("email")
    if (isEmptyOrSpaces(userId.value) || isEmptyOrSpaces(password.value)) {
        console.log("empty")
        return;
    } else {
        e.preventDefault()
        authenticateUser(userId.value, password.value, email.value);
    }
});

function authenticateUser(userId, password, email) {
    const dbRef = ref(database);
    get(child(dbRef, "userList/"+userId)).then((snapshot)=>{
        console.log("B");
        if (snapshot.exists()) {
            let dbpass = snapshot.val().password;
            if (dbpass == password) {
                login(userId, password, email);
            } else {
                alert("password is incorrect")
            }
        } else {
            alert(`userList/${userId} User does not exist`)
            
        }
    });
}


function login(username, loginPassword, loginEmail) {
    signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then((userCredential) => {
        // User successfully logged in
        const user = userCredential.user;
        sessionStorage.setItem('user', JSON.stringify(username));
        console.log("Logged in user:", user, username);
        //window.location.href = "../StorageUnit.html?username=" + encodeURIComponent(user);
    })
    .catch((error) => {
        // Handle login errors
        alert("Error signing in:"+error);
        // Display an error message to the user or perform any necessary error handling.
    });
};
// Register --------------------------------------

const registerBtn = document.getElementById("register");

registerBtn.addEventListener("click", (e)=> {
    const registerLocation = document.getElementById("register-location");
    const registerEmail = document.getElementById("register-email");
    const registerUserId = document.getElementById("register-user-id");
    const registerPassword = document.getElementById("register-password");
    
    if (isEmptyOrSpaces(registerLocation.value) || isEmptyOrSpaces(registerEmail.value) || isEmptyOrSpaces(registerUserId.value) || isEmptyOrSpaces(registerPassword.value )) {
        return;
    } else {
        e.preventDefault()
        registerUser(registerLocation.value, registerEmail.value, registerUserId.value, registerPassword.value)
    }
});


function isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
}

function validation(registerLocation, registerEmail, registerUserId, registerPassword) {
    let nameregx = /^[a-zA-Z]+$/;
    let email = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|eaglerockmanagement)\.com$/;
    let userregx = /^[a-zA-Z0-9]{5,}$/;
    let passwordregx = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    
    if (isEmptyOrSpaces(registerLocation) || isEmptyOrSpaces(registerEmail) || isEmptyOrSpaces(registerUserId) || isEmptyOrSpaces(registerPassword)) {
        alert("All fields must be completed");
        return false;
    }
    if (!nameregx.test(registerLocation)) {
        alert("The name should only contain letters");
        return false;
    }
    if (!email.test(registerEmail)) {
        alert("Enter valid email");
        return false;
    }
    if (!userregx.test(registerUserId)) {
        alert("-username can only be alphanumeric\n-username must be at least 5 characters\n-username cannot contain spaces");
        return false;
    }
    if (!passwordregx.test(registerPassword)) {
        alert("-Password needs 6 or more characters\n-Password needs 1 or more uppercase letter\n-Password needs 1 or more number")
    }
    return true;
}

function registerUser(registerLocation, registerEmail, registerUserId, registerPassword) {
    if (!validation(registerLocation, registerEmail, registerUserId, registerPassword)) {
        return;
    };

    const dbRef = ref(database);

    get(child(dbRef, "userList/"+registerUserId)).then((snapshot)=>{
        if (snapshot.exists()) {
            alert("Account already exists")
        }
        else {
            set(ref(database, "userList/"+ registerUserId),
            {
                fullname: registerLocation,
                email: registerEmail,
                username: registerUserId,
                password: registerPassword
            })
            .then(()=> {
                alert("User added successfully");
                printUsers(dbRef);
                // Create an authenticated user with email and password
                createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
                .then((userCredential) => {
                  const user = userCredential.user;
                  console.log("Newly created user:", user);
                  // Perform further actions after successful user creation
                })
                .catch((error) => {
                  console.error("Error creating user:"+error);
                });
            })
            .catch((error)=> {
                alert("Error adding user"+error);
            })
        }
    })
}

function printUsers(dbRef) {
    get(child(dbRef, "userList")).then((snapshot) => {
      if (snapshot.exists()) {
        // The snapshot contains all user data under the "userList" node
        // Loop through each user and log their information
        snapshot.forEach((userSnapshot) => {
          const userData = userSnapshot.val();
          console.log("User ID:", userSnapshot.key);
          console.log("Fullname:", userData.fullname);
          console.log("Email:", userData.email);
          console.log("Username:", userData.username);
          console.log("Password:", userData.password);
          console.log("------------");
        });
      } else {
        console.log("No users found in the database.");
      }
    });
  }



