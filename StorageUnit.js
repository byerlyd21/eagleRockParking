
//Search unit by first and last name variables
const fullName = document.getElementById("name");
const searchUnitButton = document.getElementById("search-unit-button");
const unitInfo = document.getElementById("unit-info");
const parkingInfo = document.getElementById("parking-info");
const aptInfo = document.getElementById("apt-info");

searchUnitButton.addEventListener("click", searchUnit);

//Search frist and last name by unit variables
const unit = document.getElementById("unit");
const searchNameButton = document.getElementById("search-name-button");
const nameInfo = document.getElementById("name-info");
const parkingInfoA = document.getElementById("parking-infoA");
const aptInfoA = document.getElementById("apt-infoA");

searchNameButton.addEventListener("click", searchName);

//Search parking code by apt
const apt = document.getElementById("apt");
const searchAptButton = document.getElementById("search-apt-button");
const parkingCode = document.getElementById("parking-code");

searchAptButton.addEventListener("click", findCode);

//Add New information
const firstName = getElementById("firstName");
const firstNameError = getElementById("firstName-error");
const lastName = getElementById("lastName");
const lastNameError = getElementById("lastName-error");
const apartment = getElementById("apt-input");
const aptError = getElementById("apt-error");
const year = getElementById("year");
const yearError = getElementById("year-error");
const make = getElementById("make");
const makeError = getElementById("make-error");
const model = getElementById("model");
const modelError = getElementById("model-error");
const lp = getElementById("lp#");
const lpError = getElementById("lp#-error");
const lpState = getElementById("lpState");
const lpStateError = getElementById("lpStatex-error");
const updateInfoButton = getElementById("update-button");

updateInfoButton.addEventListener("click", updateInfo);

unitDict = {

    "bobjohnson" : ["64", "Garage", "99-999"]
};

nameDict = {

    "64" : ["Bob Johnson", "Garage", "99-999"]
}

codeDict = {

    "T" : "0", "H" : "1", "E" : "2", "C" : "3", "O" : "4", "M" : "5", "P" : "6", "A" : "7", "N" : "8", "Y" : "9"
}

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
    unitInfo.innerHTML = `Unit: ${unitDict[nameUpdate][0]}`;
    parkingInfo.innerHTML = `Parking: ${unitDict[nameUpdate][1]}`;
    aptInfo.innerHTML = `Apartment: ${unitDict[nameUpdate][2]}`;
    }
}


function searchName() {
    
    if (unit.value === "") {
        nameInfo.innerHTML = `Please input a garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
        return;
    }

    let nameUpdateA = unit.value.toLowerCase().replaceAll(/\s/g, "");
    
    if (!(nameUpdateA in nameDict)) {
        nameInfo.innerHTML = `Please input a valid garage number`
        parkingInfoA.innerHTML = "";
        aptInfoA.innerHTML = "";
    } else {
    nameInfo.innerHTML = `Name: ${nameDict[nameUpdateA][0]}`;
    parkingInfoA.innerHTML = `Parking: ${nameDict[nameUpdateA][1]}`;
    aptInfoA.innerHTML = `Apartment: ${nameDict[nameUpdateA][2]}`;
    }

}

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

const fields = [firstName, lastName, apartment, year, make, model, lp, lpState]

function updateInfo() {

    for (item in fields) {
        if (item.value === "") {
            return errorMessage(item);
        } else {
            let firstLast = firstName + lastName
            unitDict.firstLast = {
                "apartment" : apartment,
                "carYear" : year,
                "carMake" : make,
                "carModel" : model, 
                "licensePlate" : lp,
                "licensePlateState" : lpState
                 }
        }
    }
}

function errorMessage(item) {
    let errorLocation = item + "-error"
    errorLocation.innerHTML = `${item} is missing a value`

}