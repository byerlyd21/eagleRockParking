// import { initializeApp } from 'firebase/app';

// // TODO: Replace the following with your app's Firebase project configuration
// const firebaseConfig = {
    
//         apiKey: process.env.API_KEY,
//         authDomain: "eagle-rock-parking.firebaseapp.com",
//         // The value of `databaseURL` depends on the location of the database
//         databaseURL: "https://DATABASE_NAME.firebaseio.com",
//         projectId: "eagle-rock-parking",
//         storageBucket: "eagle-rock-parking.appspot.com",
//         messagingSenderId: process.env.SENDER_ID,
//         appId: process.env.APP_ID,
//         // For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field
//         measurementId: process.env.G-MEASUREMENT_ID
// };

//const app = initializeApp(firebaseConfig);


//import { getDatabase, ref, set } from "firebase/database";

//const database = getDatabase();


// function writeUserData(userId, name, email, imageUrl) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     username: name,
//     email: email,
//     profile_picture : imageUrl
//   });
// }

//Objects

unitDict = {

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

nameDict = [

    false,
    "Garage 2 is unassigned",
    "Garage 3 is unassigned",
    "Garage 4 is unassigned",
    "Garage 5 is unassigned",
    "Garage 6 is unassigned",
    "Garage 7 is unassigned",
     unitDict["bobjohnson"]
]

codeDict = {

    "T" : "0", "H" : "1", "E" : "2", "C" : "3", "O" : "4", "M" : "5", "P" : "6", "A" : "7", "N" : "8", "Y" : "9"
}

lpDict = {
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
        unitInfo.innerHTML = `Please input a first and last name`
        parkingInfo.innerHTML = "";
        aptInfo.innerHTML = "";
        return;
    }

    let fullNameRaw = fullName.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (!(fullNameRaw in unitDict)) {
        unitInfo.innerHTML = `Please input a valid first and last name`
        parkingInfo.innerHTML = "";
        aptInfo.innerHTML = "";
    } else {
    unitInfo.innerHTML = `Unit: ${unitDict[fullNameRaw]["garage"]}`;
    parkingInfo.innerHTML = `Parking: ${unitDict[fullNameRaw]["parkingType"]}`;
    aptInfo.innerHTML = `Apartment: ${unitDict[fullNameRaw]["apartment"]}`;
    }
}

//Search frist and last name by garageNum variables
const garageNum = document.getElementById("unit");
const searchNameButton = document.getElementById("search-name-button");
const nameInfo = document.getElementById("name-info");
const parkingInfoA = document.getElementById("parking-infoA");
const aptInfoA = document.getElementById("apt-infoA");

searchNameButton.addEventListener("click", searchName);

function searchName() {
    
    if (garageNum.value === "") {
        nameInfo.innerHTML = `Please input a garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
        return;
    }

    // Remove any spaces or "-" in text box
    let garageNumRaw = Number(garageNum.value.replaceAll(/[\s-]/g, ""));
    
    
    //Check to make sure garage number is a number and between 1 and 8
    if ((garageNumRaw > nameDict.length || garageNumRaw === 0 || isNaN(garageNumRaw))) {
        nameInfo.innerHTML = `Please input a valid garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
    } else if (nameDict[garageNumRaw - 1]["firstName"] != undefined) {
        nameInfo.innerHTML = `Name: ${nameDict[garageNumRaw - 1]["firstName"]} ${nameDict[garageNumRaw - 1]["lastName"]}`;
        parkingInfoA.innerHTML = `Parking: ${nameDict[garageNumRaw - 1]["parking"]}`;
        aptInfoA.innerHTML = `Apartment: ${nameDict[garageNumRaw - 1]["apartment"]}`;
    } else {
        nameInfo.innerHTML = nameDict[garageNumRaw - 1];
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
    }

}

//Search parking code by apt
const apt = document.getElementById("apt");
const searchAptButton = document.getElementById("search-apt-button");
const parkingCode = document.getElementById("parking-code");

searchAptButton.addEventListener("click", findCode);

function findCode() {
    
    if (apt.value === "") {
        parkingCode.innerHTML = `Please input an parking code`
        return;
    }

    let codeUpdate = apt.value.replaceAll(/[^\w\s]/g, "").toUpperCase();
    
    if (!(codeUpdate.length === 5)) {
        parkingCode.innerHTML = `Please input a valid parking code`
        return;

    } else {
        let result = ""
        for (i = 0; i < 5; i++) {
            result += (codeDict[codeUpdate[i]])
            if (result.length == 2) {
                result += "-"
            }
        }
            parkingCode.innerHTML = `Apt: ${result}`
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
        lpName.innerHTML = `Please input the license plate`
        lpApt.innerHTML = ""
        lpParkingType.innerHTML = ""
        lpSpaceNum.innerHTML = ""
        return;
    }
    //remove special charecters and whitespace
    let lpRaw = licensePlate.value.replaceAll(/[^\w\s\d]/g, "").toUpperCase();
    console.log(lpRaw)

    if (!(lpRaw in lpDict )) {
        lpName.innerHTML = `License plate not in database`
        lpApt.innerHTML = ""
        lpParkingType.innerHTML = ""
        lpSpaceNum.innerHTML = ""

    } else if (lpRaw.length < 0 || lpRaw.length > 10) {
        lpName.innerHTML = `Please input a valid license plate`
        lpApt.innerHTML = ""
        lpParkingType.innerHTML = ""
        lpSpaceNum.innerHTML = ""
        return; 
    } else {
        //finding the name from the lpDict, and getting the rest of the info with the name and unitDict
        lpName.innerHTML = `Name: ${unitDict[lpDict[lpRaw]]["firstName"]} ${unitDict[lpDict[lpRaw]]["lastName"]}`
        lpApt.innerHTML = `Apt: ${unitDict[lpDict[lpRaw]]["apartment"]}`
        lpParkingType.innerHTML = `Parking Type: ${unitDict[lpDict[lpRaw]]["parkingType"]}`
        lpSpaceNum.innerHTML = `Paring Space: ${unitDict[lpDict[lpRaw]]["parkingSpace"]}`
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
    
    for (i = 0; i < 8; i ++) {
        if (fields[i].value === "") {
            errors[i].innerHTML = "This field is missing a value"
            return;
        } else {
            errors[i].innerHTML = "";
        }
    }
    
    //updated to show message if user does not input anything in these fields
    

    if (parkingType.value === "") {
        parkingType.value = "Not Applicable"
    }
    
    if (parkingSpaceNum.value === "" && parkingType.value.toLowerCase() === "premier") {
        parkingSpaceNumError.innerHTML = "Premier parking needs a space number"
    } else if (parkingSpaceNum.value === "") {
        parkingSpaceNum.value = "Not Applicable"
    } else if (parkingSpaceNum.value === "" && parkingType.value.toLowerCase() === "covered") {
        parkingSpaceNumError.value = "Covered parking needs a space number"
    } else {
        parkingSpaceNumError.innerHTML = ""
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
    console.log("working")
    if (newGarageRaw < 1) {
        return;
    } else if (newGarageRaw > 8) {
        errors[9].innerHTML = "MetroWest only has garages 1-8"
    } else if (nameDict[newGarageRaw -1] === false) {
        nameDict[newGarageRaw -1] = unitDict[firstLast]
    } else {
        errors[9].innerHTML = "This garage is already taken"
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

    addGarage(newGarageRaw, firstLast);
}

// Remove Resident
const removeBtn = document.getElementById("remove-resident-button")
removeBtn.addEventListener("click", removeResident);

function removeResident() {
    const residentRemoved = document.getElementById("resident-remove-name");
    const removedResConf = document.getElementById("removed-resident-confirmation");

    if (residentRemoved.value === "") {
        removedResConf.innerHTML = "Please input resident you would like to remove"
        return;
    }
    
    //change to unitDict key format (lower-case with no spaces)
    let residentRemovedRaw = residentRemoved.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (residentRemovedRaw in unitDict) {
        removedResConf.innerHTML = `${unitDict[residentRemovedRaw]["firstName"]} ${unitDict[residentRemovedRaw]["lastName"]} was removed from the database`
        delete unitDict[residentRemovedRaw]
        console.log(unitDict)
    } else {
        removedResConf.innerHTML = "Resident not found"
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
        console.log(type)
        return false;
    }
});

const csvFileInput = document.querySelector("#drop-file");

const submitBtn = document.getElementById("submit-btn");
submitBtn.addEventListener("click", parse(csvFileInput));


function parse() {
    console.log("submit")
    const reader = new FileReader();
    const file = csvFileInput.files[0];
    reader.onload = function (e) {
        console.log("content: ", e.target.result);
    }
    reader.readAsText(file);
};

const form = document.querySelector(".csv-form");

form.addEventListener("submit", function (event) {
    const reader = new FileReader();
    const file = csvFileInput.files[0];
    console.log("submiting")
    event.preventDefault();
    reader.onload = function (e) {
        console.log("content: ", e.target.result);
    }
    reader.readAsText(file);
});

