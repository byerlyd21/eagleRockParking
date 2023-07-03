import { initializeApp } from 'firebase/app';

// TODO: Replace the following with your app's Firebase project configuration


const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set } from "firebase/database";

const database = getDatabase();


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
        "parking" : "regular",
        "garage" : "8"}
};

nameDict = [

    "Garage 1 is unassigned",
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

//Search unit by first and last name variables
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

    let nameUpdate = fullName.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (!(nameUpdate in unitDict)) {
        unitInfo.innerHTML = `Please input a valid first and last name`
        parkingInfo.innerHTML = "";
        aptInfo.innerHTML = "";
    } else {
    unitInfo.innerHTML = `Unit: ${unitDict[nameUpdate]["garage"]}`;
    parkingInfo.innerHTML = `Parking: ${unitDict[nameUpdate]["parking"]}`;
    aptInfo.innerHTML = `Apartment: ${unitDict[nameUpdate]["apartment"]}`;
    }
}

//Search frist and last name by unit variables
const unit = document.getElementById("unit");
const searchNameButton = document.getElementById("search-name-button");
const nameInfo = document.getElementById("name-info");
const parkingInfoA = document.getElementById("parking-infoA");
const aptInfoA = document.getElementById("apt-infoA");

searchNameButton.addEventListener("click", searchName);

function searchName() {
    
    if (unit.value === "") {
        nameInfo.innerHTML = `Please input a garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
        return;
    }

    let nameUpdateA = Number(unit.value.toLowerCase().replaceAll(/\s/g, ""));
    
    if ((nameUpdateA > nameDict.length || nameUpdateA === 0)) {
        nameInfo.innerHTML = `Please input a valid garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
    } else if (nameDict[nameUpdateA - 1]["firstName"] != undefined) {
        nameInfo.innerHTML = `Name: ${nameDict[nameUpdateA - 1]["firstName"]} ${nameDict[nameUpdateA - 1]["lastName"]}`;
        parkingInfoA.innerHTML = `Parking: ${nameDict[nameUpdateA - 1]["parking"]}`;
        aptInfoA.innerHTML = `Apartment: ${nameDict[nameUpdateA - 1]["apartment"]}`;
    } else {
        nameInfo.innerHTML = nameDict[nameUpdateA - 1];
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

addInfoButton.addEventListener("click", addInfo);

const fields = [firstName, lastName, apartment, year, make, model, lp, lpState];
const errors = [firstNameError, lastNameError, aptError, yearError, makeError, modelError, lpError, lpStateError];

function addInfo() {
    
    for (i = 0; i < 8; i ++) {
        if (fields[i].value === "") {
            console.log("bad")
            errors[i].innerHTML = "This field is missing a value"
            return;
        } else {
            errors[i].innerHTML = "";
        }
    }
    confirmAddInfo()

}

// Confirm update
const confirmUpdate = document.querySelector(".confirm-update");


function confirmAddInfo() {

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
    
    //let firstLast = (firstName.value + lastName.value).toLowerCase()
    //console.log(firstLast)
    unitDict[firstName.value] = {
        "firstName" : firstName.value,
        "lastName" : lastName.value, 
        "apartment" : apartment.value, 
        "year" : year.value,
        "make" : make.value,
        "model" : model.value,
        "lp" : lp.value,
        "lpState" : lpState.value};
    console.log(unitDict)
}