import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, child, get } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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
const userJSON = sessionStorage.getItem('user');
const userCode = JSON.parse(userJSON);

const userLocationInDB = "userList/" + userCode
const dbRef = ref(database);

// Fetch the user data from the Realtime Database using the user's uid
get(child(dbRef, userLocationInDB)).then((snapshot) => {
    if (snapshot.exists()) {
        const userData = snapshot.val();
        console.log("Username:", userData.username);
        const userMessage = document.getElementById("user-message");
        userMessage.innerText = `${userData.fullname} Vehicle Information`
        // Now you have access to the 'username' property for the logged-in user
    } else {
        console.log("User data not found");
        console.log(`user.uid: ${user.uid}`)
    }
}).catch((error) => {
    console.error("Error fetching user data:", error);
});


onAuthStateChanged(auth, (user)=> {
    if (user) {
        console.log(`${user} logged in!`)
        console.log(user)
    } else {
        window.location.href = "./login-test/login.html"
        console.log("no user")
    }
});

const unitDict = {

    "bobjohnson" : { 
        "firstName" : "Bob",
        "lastName" : "Johnson", 
        "apartment" : "55-555", 
        "year" : "2007",
        "make" : "Honda",
        "model" : "Accord",
        "lp" : "78H92",
        "lpState" : "MA",
        "parkingType" : "regular",
        "garage" : "8",
        "parkingSpace" : "regular"}
};

const nameDict = [

    false,
    "Garage 2 is unassigned",
    "Garage 3 is unassigned",
    "Garage 4 is unassigned",
    "Garage 5 is unassigned",
    "Garage 6 is unassigned",
    "Garage 7 is unassigned",
     unitDict["bobjohnson"]
]

const codeDict = {

    "T" : "0", "H" : "1", "E" : "2", "C" : "3", "O" : "4", "M" : "5", "P" : "6", "A" : "7", "N" : "8", "Y" : "9"
}
const codeClaculator = {

    "0" : "T", "1" : "H", "2" : "E", "3" : "C", "4" : "O", "5" : "M", "6" : "P", "7" : "A", "8" : "N", "9" : "Y"
}

const lpDict = {
    "78H92" : "bobjohnson"
}

//Search garageNum by first and last name variables
const fullName = document.getElementById("name");
const searchUnitButton = document.getElementById("search-unit-button");
const unitInfo = document.getElementById("unit-info");
const parkingInfo = document.getElementById("parking-info");
const aptInfo = document.getElementById("apt-info");

searchUnitButton.addEventListener("click", searchUnit);

function searchUnit() {
    if (fullName.value === "") {
        unitInfo.innerText = `Please input a first and last name`
        parkingInfo.innerText = "";
        aptInfo.innerText = "";
        return;
    }

    let fullNameRaw = fullName.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (!(fullNameRaw in unitDict)) {
        unitInfo.innerText = `Please input a valid first and last name`
        parkingInfo.innerText = "";
        aptInfo.innerText = "";
    } else {
    unitInfo.innerText = `Unit: ${unitDict[fullNameRaw]["garage"]}`;
    parkingInfo.innerText = `Parking: ${unitDict[fullNameRaw]["parkingType"]}`;
    aptInfo.innerText = `Apartment: ${unitDict[fullNameRaw]["apartment"]}`;
    }
}

//Search first and last name by garageNum variables
const garageNum = document.getElementById("unit");
const searchNameButton = document.getElementById("search-name-button");
const nameInfo = document.getElementById("name-info");
const parkingInfoA = document.getElementById("parking-infoA");
const aptInfoA = document.getElementById("apt-infoA");

searchNameButton.addEventListener("click", searchName);

function searchName() {
    
    if (garageNum.value === "") {
        nameInfo.innerText = `Please input a garage number`
        parkingInfoA.innerText = "";
        aptInfoA.innerText = "";
        return;
    }

    // Remove any spaces or "-" in text box
    let garageNumRaw = Number(garageNum.value.replaceAll(/[\s-]/g, ""));
    
    
    //Check to make sure garage number is a number and between 1 and 8
    if ((garageNumRaw > nameDict.length || garageNumRaw === 0 || isNaN(garageNumRaw))) {
        nameInfo.innerText = `Please input a valid garage number`
        parkingInfoA.innerText = "";
        aptInfoA.innerText = "";
    } else if (nameDict[garageNumRaw - 1]["firstName"] != undefined) {
        nameInfo.innerText = `Name: ${nameDict[garageNumRaw - 1]["firstName"]} ${nameDict[garageNumRaw - 1]["lastName"]}`;
        parkingInfoA.innerText = `Parking: ${nameDict[garageNumRaw - 1]["parking"]}`;
        aptInfoA.innerText = `Apartment: ${nameDict[garageNumRaw - 1]["apartment"]}`;
    } else {
        nameInfo.innerText = nameDict[garageNumRaw - 1];
        parkingInfoA.innerText = "";
        aptInfoA.innerText = "";
    }

}

//Search parking code by apt
const apt = document.getElementById("apt");
const searchAptButton = document.getElementById("search-apt-button");
const parkingCode = document.getElementById("parking-code");

searchAptButton.addEventListener("click", findCode);

function findCode() {
    
    if (apt.value === "") {
        parkingCode.innerText = `Please input an parking code`
        return;
    }

    let codeUpdate = apt.value.replaceAll(/[^\w\s]/g, "").toUpperCase();
    
    if (!(codeUpdate.length === 5)) {
        parkingCode.innerText = `Please input a valid parking code`
        return;

    } else {
        let result = ""
        for (let i = 0; i < 5; i++) {
            //change back to code dict
            result += (codeClaculator[codeUpdate[i]])
            if (result.length == 2) {
                result += "-"
            }
        }
            parkingCode.innerText = `Apt: ${result}`
    }
}

// search resident by license plate
const licensePlate = document.getElementById("licensePlate");
const searchLpBtn = document.getElementById("search-lp-button");
const lpName = document.getElementById("name-info-lp");
const lpApt = document.getElementById("apt-info-lp");
const lpParkingType = document.getElementById("lp-parking-type");
const lpSpaceNum = document.getElementById("lp-space-num");

searchLpBtn.addEventListener("click", searchLp);

function searchLp() {
    console.log("working")
    if (licensePlate.value === "") {
        lpName.innerText = `Please input the license plate`
        lpApt.innerText = ""
        lpParkingType.innerText = ""
        lpSpaceNum.innerText = ""
        return;
    }
    //remove special charecters and whitespace
    let lpRaw = licensePlate.value.replaceAll(/[^\w\s\d]/g, "").toUpperCase();
    console.log(lpRaw)

    if (!(lpRaw in lpDict )) {
        lpName.innerText = `License plate not in database`
        lpApt.innerText = ""
        lpParkingType.innerText = ""
        lpSpaceNum.innerText = ""

    } else if (lpRaw.length < 0 || lpRaw.length > 10) {
        lpName.innerText = `Please input a valid license plate`
        lpApt.innerText = ""
        lpParkingType.innerText = ""
        lpSpaceNum.innerText = ""
        return; 
    } else {
        //finding the name from the lpDict, and getting the rest of the info with the name and unitDict
        lpName.innerText = `Name: ${unitDict[lpDict[lpRaw]]["firstName"]} ${unitDict[lpDict[lpRaw]]["lastName"]}`
        lpApt.innerText = `Apt: ${unitDict[lpDict[lpRaw]]["apartment"]}`
        lpParkingType.innerText = `Parking Type: ${unitDict[lpDict[lpRaw]]["parkingType"]}`
        lpSpaceNum.innerText = `Paring Space: ${unitDict[lpDict[lpRaw]]["parkingSpace"]}`
    }
}

//Add New information
const firstName = document.getElementById("firstName");
const firstNameError = document.getElementById("firstName-error");
const lastName = document.getElementById("lastName");
const lastNameError = document.getElementById("lastName-error");
const apartment = document.getElementById("apt-input");
const aptError = document.getElementById("apt-error");
const year = document.getElementById("year");
const yearError = document.getElementById("year-error");
const make = document.getElementById("make");
const makeError = document.getElementById("make-error");
const model = document.getElementById("model");
const modelError = document.getElementById("model-error");
const lp = document.getElementById("lp#");
const lpError = document.getElementById("lp#-error");
const lpState = document.getElementById("lpState");
const lpStateError = document.getElementById("lpState-error");
const addInfoButton = document.getElementById("update-button");
const parkingType = document.getElementById("parking-type");
const parkingTypeError = document.getElementById("parking-type-error");
const parkingSpaceNum = document.getElementById("parking-space");
const parkingSpaceNumError = document.getElementById("parking-space-error");
const garageNumber = document.getElementById("garage-num");
const garageNumberError = document.getElementById("garage-num-error");
addInfoButton.addEventListener("click", addInfo);

const fields = [firstName, lastName, apartment, year, make, model, lp, lpState, parkingType, garageNumber, parkingSpaceNum];
const errors = [firstNameError, lastNameError, aptError, yearError, makeError, modelError, lpError, lpStateError, parkingTypeError, garageNumberError, parkingSpaceNumError];

function addInfo() {
    
    for (let i = 0; i < 8; i ++) {
        if (fields[i].value === "") {
            errors[i].innerText = "This field is missing a value"
            return;
        } else {
            errors[i].innerText = "";
        }
    }
    
    //updated to show message if user does not input anything in these fields
    

    if (parkingType.value === "") {
        parkingType.value = "Not Applicable"
    }
    
    if (parkingSpaceNum.value === "" && parkingType.value.toLowerCase() === "premier") {
        parkingSpaceNumError.innerText = "Premier parking needs a space number"
    } else if (parkingSpaceNum.value === "") {
        parkingSpaceNum.value = "Not Applicable"
    } else if (parkingSpaceNum.value === "" && parkingType.value.toLowerCase() === "covered") {
        parkingSpaceNumError.value = "Covered parking needs a space number"
    } else {
        parkingSpaceNumError.innerText = ""
    }
    
    if (garageNumber.value === "") {
        garageNumber.value = "Not Applicable"
        confirmAddInfo(0)
    } else {
        let newGarageRaw = Number(garageNumber.value.replaceAll(/[\s-]/g, ""));
        console.log(newGarageRaw, garageNumber.value)
        confirmAddInfo(newGarageRaw)
    }
}


function addGarage(newGarageRaw, firstLast) {

    if (newGarageRaw < 1) {
        return;
    } else if (newGarageRaw > 8) {
        errors[9].innerText = "MetroWest only has garages 1-8"
    } else if (nameDict[newGarageRaw -1] === false) {
        nameDict[newGarageRaw -1] = unitDict[firstLast]
    } else {
        errors[9].innerText = "This garage is already taken"
        return;
    }
}

// Confirm update
const confirmUpdate = document.querySelector(".confirm-update");


function confirmAddInfo(newGarageRaw) {

    confirmUpdate.value = 
    `Does this information look right?\r\n
    First Name: ${firstName.value}\r\n
    Last Name: ${lastName.value}\r\n
    Apartment: ${apartment.value}\r\n
    Year: ${year.value}\r\n
    Make: ${make.value}\r\n
    Model: ${model.value}\r\n
    License Plate: ${lp.value}\r\n
    License Plate State: ${lpState.value}`;
    
    let firstLast = (firstName.value + lastName.value).toLowerCase()

    addGarage(newGarageRaw, firstLast);
    
    unitDict[firstLast] = {
        "firstName" : firstName.value,
        "lastName" : lastName.value, 
        "apartment" : apartment.value, 
        "year" : year.value,
        "make" : make.value,
        "model" : model.value,
        "lp" : lp.value,
        "lpState" : lpState.value,
        "garage" : garageNumber.value, 
        "parkingType" : parkingType.value,
        "parkingSpace" : parkingSpaceNum.value};
    console.log(unitDict)

    updateRTDB(unitDict[firstLast], firstLast);
}

function updateRTDB(object, firstLast) {
    set(ref(database, userLocationInDB + "/residentData/" + firstLast), object)
    .then(() => {
        console.log("Data set successfully!");
    })
    .catch((error) => {
        console.error("Error setting data:", error);
    });
}

// Remove Resident
const removeBtn = document.getElementById("remove-resident-button")
removeBtn.addEventListener("click", removeResident);

function removeResident() {
    const residentRemoved = document.getElementById("resident-remove-name");
    const removedResConf = document.getElementById("removed-resident-confirmation");

    if (residentRemoved.value === "") {
        removedResConf.innerText = "Please input resident you would like to remove"
        return;
    }
    
    //change to unitDict key format (lower-case with no spaces)
    let residentRemovedRaw = residentRemoved.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (residentRemovedRaw in unitDict) {
        removedResConf.innerText = `${unitDict[residentRemovedRaw]["firstName"]} ${unitDict[residentRemovedRaw]["lastName"]} was removed from the database`
        delete unitDict[residentRemovedRaw]

    } else {
        removedResConf.innerText = "Resident not found"
    }
};



// Update Database with CSV file
const dropFile = document.getElementById("drop-file");

dropFile.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropFile.classList.remove("hover")
});

dropFile.addEventListener("drop", (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const type = file.type;
    if (type == "text/csv") {
    } else {
        dropFile.setAttribute("class", "dropFile invalid");
        dropFile.innerText = "Invalid File";
        return false;
    }
});

// const csvFileInput = document.querySelector("#drop-file");

// const submitBtn = document.getElementById("submit-btn");
// submitBtn.addEventListener("click", parse(csvFileInput));


// function parse() {
//     console.log("submit")
//     const reader = new FileReader();
//     const file = csvFileInput.files[0];
//     reader.onload = function (e) {
//         console.log("content: ", e.target.result);
//     }
//     reader.readAsText(file);
// };

// const form = document.querySelector(".csv-form");

// form.addEventListener("submit", function (event) {
//     const reader = new FileReader();
//     const file = csvFileInput.files[0];
//     console.log("submiting")
//     event.preventDefault();
//     reader.onload = function (e) {
//         console.log("content: ", e.target.result);
//     }
//     reader.readAsText(file);
// });



//guest parking


const numGuest = 25;
const guestUl = document.getElementById("guest-ul");
const guestParkingList = []

for (let i = 0; i < numGuest; i++) {

    const guestSpace = document.createElement("li");
    guestSpace.innerText = `Avaliable`;
    guestSpace.style.background = "rgb(44,97,69)"
    guestSpace.className = "list-item";
    guestUl.appendChild(guestSpace);
    guestParkingList.push([guestSpace, false]);
    //use IIFE to apply event listener to reserve guest space button
    (function (spaceNum) {
        guestSpace.addEventListener("click", function() {
        verifyStatus(spaceNum);
        });
    })(i + 1);
    
    function verifyStatus(spaceNum) {

        if (guestParkingList[spaceNum][1] === false) {
            console.log('false')
            reserveGuest(spaceNum)
        } else if (guestParkingList[spaceNum][1] === true) {
            console.log('true')
            viewGuest(spaceNum);
        }}  
   
    };
    
    function viewGuest(spaceNum) {
        const popupContainer = document.getElementById("popupContainer");
        const popupContent = document.getElementById("popupContent");
        popupContent.textContent = `Guest card`;
        popupContainer.style.display = "block";
    
        const closePopupButton = document.getElementById("closePopup");
        closePopupButton.addEventListener("click", function() {
            const popupContainer = document.getElementById("popupContainer");
            popupContainer.style.display = "none";
        });

        window.addEventListener("click", function(event) {
            const popupContainer = document.getElementById("popupContainer");
            if (event.target === popupContainer) {
                popupContainer.style.display = "none";
            }
        });
        const removeGuestbtn = document.getElementById("reserve-button")
        removeGuestbtn.innerText = "Remove Guest"
        removeGuestbtn.addEventListener("click",  ()=> {
            remove(spaceNum, popupContainer)
        })};

    function remove(spaceNum, popupContainer) {
        guestParkingList[spaceNum - 1][0].innerText = `Avaliable`
        guestParkingList[spaceNum - 1][0].style.background = "rgb(44,97,69)"
        guestParkingList[spaceNum][1] = false
        popupContainer.style.display = "none";
    }

    function reserveGuest(spaceNum) {
        console.log(`working ${spaceNum}`);
        const popupContainer = document.getElementById("popupContainer");
        const popupContent = document.getElementById("popupContent");
        popupContent.textContent = `Enter the Guest Car information for Guest space ${spaceNum} below`;
        popupContainer.style.display = "block";
    
        const closePopupButton = document.getElementById("closePopup");
        closePopupButton.addEventListener("click", function() {
            const popupContainer = document.getElementById("popupContainer");
            popupContainer.style.display = "none";
        });

        window.addEventListener("click", function(event) {
            const popupContainer = document.getElementById("popupContainer");
            if (event.target === popupContainer) {
                popupContainer.style.display = "none";
            }
        });
        const reserveGuestbtn = document.getElementById("reserve-button")
        reserveGuestbtn.innerText = "Reserve"
        reserveGuestbtn.addEventListener("click", ()=> {
            reserve(spaceNum, popupContainer)
        })};

    function reserve(spaceNum, popupContainer) {
        guestParkingList[spaceNum - 1][0].innerText = "Reserved"
        guestParkingList[spaceNum - 1][0].style.background = "rgb(151,129,60)"
        guestParkingList[spaceNum][1] = true
        const guest = document.getElementById("first-name-g");
        popupContainer.style.display = "none";
    }

//accordian boxes

const label = document.getElementsByClassName("label");
const labelArray = Array.from(label); // Convert HTMLCollection to an array

const accordian = document.getElementsByClassName("contentBx");
const accordianArray = Array.from(accordian); // Convert HTMLCollection to an array

for (let i = 0; i < accordianArray.length; i++) {
    labelArray[i].addEventListener("click", function(event) {
        accordianArray[i].classList.toggle('active');
});
}
