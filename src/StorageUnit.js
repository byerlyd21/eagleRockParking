import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getDatabase, ref, set, child, get, remove } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";

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
        alert("No User: You will be logged out")
        window.location.href = "./login-test/login.html"
    }
}).catch((error) => {
    console.error("Error fetching user data:", error);
});


onAuthStateChanged(auth, (user)=> {
    if (user) {
        console.log(`${user.email} logged in!`)
        console.log(user)
    } else {
        window.location.href = "./login-test/login.html"
        console.log("no user")
    }
});



// create correct number of garages
const numOfGarages = 8;
for (let i = 1; i <= numOfGarages; i ++) {
    get(child(dbRef, userLocationInDB + "/garages/" + ("garage" + i))).then((snapshot)=>{
        if (snapshot.exists() && !snapshot.val() == false) {
            return;
    } else {
        try {
            set(ref(database, userLocationInDB + "/garages/" + ("garage" + i)), false)
        } catch (error) {
            alert("Error: ", error)
        }
    }})   
}
    
    

// const unitDict = {

//     "bobjohnson" : { 
//         "firstName" : "Bob",
//         "lastName" : "Johnson", 
//         "apartment" : "55-555", 
//         "year" : "2007",
//         "make" : "Honda",
//         "model" : "Accord",
//         "lp" : "78H92",
//         "lpState" : "MA",
//         "parkingType" : "regular",
//         "garage" : "8",
//         "parkingSpace" : "regular"}
// };

// const nameDict = [

//     false,
//     "Garage 2 is unassigned",
//     "Garage 3 is unassigned",
//     "Garage 4 is unassigned",
//     "Garage 5 is unassigned",
//     "Garage 6 is unassigned",
//     "Garage 7 is unassigned",
//      unitDict["bobjohnson"]
// ]

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
const carInfo = document.getElementById("car-info");
const lpInfo = document.getElementById("lp-info");

searchUnitButton.addEventListener("click", searchUnit);

function searchUnit() {
    if (fullName.value === "") {
        unitInfo.innerText = `Please input a first and last name`
        parkingInfo.innerText = "";
        aptInfo.innerText = "";
        carInfo.innerText = "";
        lpInfo.innerText = "";
        return;
    }

    let fullNameRaw = fullName.value.toLowerCase().replaceAll(/\s/g, "");
    
    findInDB(fullNameRaw);
}

function findInDB(fullNameRaw) {
    get(child(dbRef, userLocationInDB + "/residentData/" + fullNameRaw)).then((snapshot)=>{
        if (snapshot.exists()) {
            const userData = snapshot.val();
            unitInfo.innerText = `Garage: ${userData.garage}`;
            parkingInfo.innerText = `Parking: ${userData.parkingType} ${userData.parkingSpace}`;
            aptInfo.innerText = `Apartment: ${userData.apartment}`;
            carInfo.innerText = `Car: ${userData.year} ${userData.make} ${userData.model}`;
            lpInfo.innerText = `License Plate: ${userData.lp}`
        }
        else {
            alert("Resident not in database")
            unitInfo.innerText = "";
            parkingInfo.innerText = "";
            aptInfo.innerText = "";
        }
    });
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
    } else {
        findGarageInDB(garageNumRaw);
    }

}

function findGarageInDB(garageNumRaw) {
    get(child(dbRef, userLocationInDB + "/garages/" + ("garage" + garageNumRaw))).then((snapshot)=>{
        if (snapshot.exists() && !snapshot.val() == false) {
            const userData = snapshot.val();
            nameInfo.innerText = `Name: ${userData.firstName} ${userData.lastName}`;
            aptInfoA.innerText = `Apartment: ${userData.apartment}`;
        }
        else {
            alert("This garage is unassigned")
            nameInfo.innerText = "";
            parkingInfoA.innerText = "";
            aptInfoA.innerText = "";
        }
    });
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

    if (lpRaw.length < 1 || lpRaw.length > 10) {
        lpName.innerText = `Please input a valid license plate`
        lpApt.innerText = ""
        lpParkingType.innerText = ""
        lpSpaceNum.innerText = ""
        return; 
    } else {
       findLicensePlateInDB(lpRaw);
    }
}

function findLicensePlateInDB(lpRaw) {
    get(child(dbRef, userLocationInDB + "/licensePlates/" + lpRaw)).then((snapshot)=>{
        if (snapshot.exists()) {
            const userData = snapshot.val();
            lpName.innerText = `Name: ${userData.firstName} ${userData.lastName}`;
            lpApt.innerText = `Apartment: ${userData.apartment}`;
            lpSpaceNum.innerText = `Space: ${userData.parkingSpace}`;
            lpParkingType.innerText = `Type: ${userData.parkingType}`;
        }
        else {
            alert("License Plate not in database")
            lpName.innerText = "";
            lpApt.innerText = "";
            lpSpaceNum.innerText = "";
            lpParkingType.innerText = "";
        }
    });
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
        confirmAddInfo(newGarageRaw)
    }
}

async function addGarage(newGarageRaw) {
    
    if (newGarageRaw == 0) {
        return true;
    }
    
    const dataRef = ref(database, userLocationInDB + "/garages/" + ("garage" + newGarageRaw));
    try {
      const snapshot = await get(dataRef);
      if (snapshot.exists() && snapshot.val() === false) {
        return true;
      } else {
        alert("This garage is already taken");
        console.log(snapshot.val());
        return false; // Return false so resident is not added if garage is taken
      }
    } catch (error) {
      console.error("Error checking garage:", error);
      return false; // Return false in case of an error
    }
  }

// Confirm update
const confirmUpdate = document.querySelector(".confirm-update");


function confirmAddInfo(newGarageRaw) {

    // confirmUpdate.value = 
    // `Does this information look right?\r\n
    // First Name: ${firstName.value}\r\n
    // Last Name: ${lastName.value}\r\n
    // Apartment: ${apartment.value}\r\n
    // Year: ${year.value}\r\n
    // Make: ${make.value}\r\n
    // Model: ${model.value}\r\n
    // License Plate: ${lp.value}\r\n
    // License Plate State: ${lpState.value}`;
    
    let firstLast = (firstName.value + lastName.value).toLowerCase()

    if (addGarage(newGarageRaw)) {
        let lpRaw = lp.value.replaceAll(/[^\w\s\d]/g, "").toUpperCase();
    
        let nameObject = {
            "firstName" : firstName.value,
            "lastName" : lastName.value, 
            "apartment" : apartment.value, 
            "year" : year.value,
            "make" : make.value,
            "model" : model.value,
            "lp" : lpRaw,
            "lpState" : lpState.value,
            "garage" : garageNumber.value, 
            "parkingType" : parkingType.value,
            "parkingSpace" : parkingSpaceNum.value
        };

        let garageObject = {
            "firstName" : firstName.value,
            "lastName" : lastName.value, 
            "apartment" : apartment.value, 
        };

        let licensePlateObject = {
            "firstName" : firstName.value,
            "lastName" : lastName.value, 
            "apartment" : apartment.value,
            "parkingType" : parkingType.value,
            "parkingSpace" : parkingSpaceNum.value
        };

        // clear fields aftwer submitting
        for (let i = 0; i < 8; i ++) {
            fields[i].value = ""
        }
        parkingType.value = "";
        parkingSpaceNum.value = "";
        garageNumber.value = "";

        updateRTDBname(nameObject, firstLast);
        if (!newGarageRaw == 0) {
            updateRTDBgarage(garageObject, garageNumber.value);
        }   
        updateRTDBlicensePlate(licensePlateObject, lpRaw);
    } else {
        console.log("not working")
    }
}

// Add resident to residentInfo in RTDB
function updateRTDBname(nameObject, firstLast) {
    set(ref(database, userLocationInDB + "/residentData/" + firstLast), nameObject)
    .then(() => {
        alert("Resident add succusfully!")
    })
    .catch((error) => {
        alert("Error setting resident info: ", error);
    });
}

// Add resident info to garages in RTDB
function updateRTDBgarage(garageObject, garageNumber) {
    set(ref(database, userLocationInDB + "/garages/" + ("garage" + garageNumber)), garageObject)
    .then(() => {
        console.log("garage added")
    })
    .catch((error) => {
        alert("Error setting garage data: ", error);
    });
}

// Add resident info to licensePlates in RTDB
function updateRTDBlicensePlate(licensePlateObject, lp) {
    set(ref(database, userLocationInDB + "/licensePlates/" + lp), licensePlateObject)
    .then(() => {
        console.log("license plate added")
    })
    .catch((error) => {
        alert("Error setting license plate data: ", error);
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
    } else {
        //change to unitDict key format (lower-case with no spaces)
        let residentRemovedRaw = residentRemoved.value.toLowerCase().replaceAll(/\s/g, "");
        removefromDB(residentRemovedRaw, residentRemoved.value);
        // clear field after submiting
        residentRemoved.value = ""
    }
};

function removefromDB(residentRemovedRaw) {
    get(child(dbRef, userLocationInDB + "/residentData/" + residentRemovedRaw)).then((snapshot)=>{
        if (snapshot.exists()) {
            const userData = snapshot.val();
            let firstName = userData.firstName;
            let lastName = userData.lastName;

            const dataRefResident = ref(database, userLocationInDB + "/residentData/" + residentRemovedRaw);
            const dataRefGarage = ref(database, userLocationInDB + "/garages/" + ("garage" + userData.garage));
            const dataRefLicense = ref(database, userLocationInDB + "/licensePlates/" + userData.lp);
            // remove resident from garages in RTDB
            try {
                if (!userData.garage == false) {
                    set(dataRefGarage, false)
                } else {
                    console.log("garage was alredy empty")
                }
                // remove resident from licensePlate in RTDB
                remove(dataRefLicense)
                // remove resident from resident info in RTDB
                remove(dataRefResident)
                    .then( ()=> {
                        alert(`${firstName} ${lastName} was removed from database`)
                    })
                    .catch((error) => {
                        console.error("Error removing data:", error);
                      });
            } catch (error) {
                alert("Error removing resident: ", error)
            }
        }
        else {
            alert("Resident not in database")
        }
    });
}


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


const processCSVbtn = document.getElementById("submit-btn");
processCSVbtn.addEventListener("click", () => {
    processCSV()
});

function processCSV() {
    const fileInput = document.getElementById("drop-file")
    const outputDiv = document.getElementById('output');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const csvData = e.target.result;
            const lines = csvData.split('\n');
            const objects = {};

            const headers = lines[0].split(',');
            headers[headers.length - 1] = headers[headers.length - 1].trim();
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                if (values.length === headers.length) {
                    const obj = {};
                    const firstLast = values[0].toLowerCase() + values[1].toLowerCase();
                    const sanitizedKey = firstLast.replace(/[^a-z0-9]/g, '');
                    const lpRaw = values[6].replace(/[^\w\s\d]/g, "").toUpperCase();
                    for (let j = 2; j < headers.length; j++) {
                        obj[headers[j]] = values[j] !== '' ? values[j] : 'Not Applicable';
                    }
                    let licensePlateObject = {
                        "firstName" : values[0],
                        "lastName" : values[1], 
                        "apartment" : values[2],
                        "parkingType" : values[8],
                        "parkingSpace" : values[9]
                    };
                    console.log(headers)
                    updateRTDBname(obj, sanitizedKey);
                    updateRTDBlicensePlate(licensePlateObject, lpRaw);
                }
            }
        };
        reader.readAsText(file);
    } else {
        outputDiv.innerHTML = 'Please select a CSV file.';
    }
}


//guest parking


const numGuest = 25;
const guestUl = document.getElementById("guest-ul");
const guestParkingList = []

verifyCellsExist()

// if cells exist => call addGuestCells
// if they don't exist => create them and then verify again
async function verifyCellsExist() {
    const dataRef = ref(database, userLocationInDB + "/guestData/reservedSpaces");
    try {
        const snapshot = await get(dataRef);
        if (snapshot.exists()) {
            const userData = snapshot.val();
            addGuestCells(userData)
        } else {
            set(dataRef, createReservedSpacesObject())
            .then(() => {
                verifyCellsExist()
            })
        }  
    } catch(error) {
       alert(`Error: ${error}`)
    }
}

// create reserved spaces object for number of guest spaces on property
function createReservedSpacesObject() {
    const reservedSpaces = {}
    for (let i = 0; i < numGuest; i ++) {
        reservedSpaces[i] = false;
    }
    return reservedSpaces;
}

// if cell is true in reservedSpaces object, create reserved cell
// if cell is false in reservedSpaces object, create avaliable cell
// add 'click' event listener that calls verify status when clicked
function addGuestCells(userData) {
    for (let i = 0; i < numGuest; i++) {
        if (userData[i]) {
            const guestSpace = document.createElement("li");
            guestSpace.innerText = "Reserved"
            guestSpace.style.background = "rgb(151,129,60)"
            guestSpace.className = "list-item";
            guestUl.appendChild(guestSpace);
            guestParkingList.push(guestSpace);
            (function (spaceNum) {
                guestSpace.addEventListener("click", function() {
                viewGuest(spaceNum, userData);
                });
            })(i + 1);
        } else {
            const guestSpace = document.createElement("li");
            guestSpace.innerText = `Avaliable`;
            guestSpace.style.background = "rgb(44,97,69)"
            guestSpace.className = "list-item";
            guestUl.appendChild(guestSpace);
            guestParkingList.push(guestSpace);
            (function (spaceNum) {
                guestSpace.addEventListener("click", function() {
                reserveGuest(spaceNum, userData)
                });
            })(i);
        }
    }
}
         

function viewGuest(spaceNum,) {
    const popupContainer = document.getElementById("popupContainer");
    const popupContent = document.getElementById("popupContent");
    popupContent.textContent = `Guest card`;
    popupContainer.style.display = "block";

    window.addEventListener("click", function(event) {
        const popupContainer = document.getElementById("popupContainer");
        if (event.target === popupContainer) {
            popupContainer.style.display = "none";
        }
    });
    const removeGuestbtn = document.getElementById("reserve-button")
    removeGuestbtn.innerText = "Remove Guest"
    removeGuestbtn.addEventListener("click",  ()=> {
        removeGuest(spaceNum, popupContainer)
})};

function removeGuest(spaceNum, popupContainer) {
    guestParkingList[spaceNum - 1].innerText = `Avaliable`
    guestParkingList[spaceNum - 1].style.background = "rgb(44,97,69)"
    popupContainer.style.display = "none";
    set(ref(database, userLocationInDB + "/guestData/reservedSpaces/" + (spaceNum - 1)), false)
    .then(() => {
        alert("Guest removed sucessfully")
    })
    }

function reserveGuest(spaceNum, userData) {
    console.log(`working ${spaceNum}`);
    const popupContainer = document.getElementById("popupContainer");
    const popupContent = document.getElementById("popupContent");
    popupContent.textContent = `Enter the Guest Car information for Guest space ${spaceNum} below`;
    popupContainer.style.display = "block";

    window.addEventListener("click", function(event) {
        const popupContainer = document.getElementById("popupContainer");
        if (event.target === popupContainer) {
            popupContainer.style.display = "none";
        }
    });
    const reserveGuestbtn = document.getElementById("reserve-button")
    reserveGuestbtn.innerText = "Reserve"
    reserveGuestbtn.addEventListener("click", ()=> {
        createGuestObject(spaceNum, popupContainer, userData)
    });
}

function createGuestObject(spaceNum, popupContainer) {
    const firstNameG = document.getElementById("first-name-g");
    const lastNameG = document.getElementById("last-name-g");
    const apartmentG = document.getElementById("apt-visit");
    const yearG = document.getElementById("year-g");
    const makeG = document.getElementById("make-g");
    const modelG = document.getElementById("model-g");
    const lpG = document.getElementById("lp#-g");
    const lpStateG = document.getElementById("lpState-g");
    const guestInputs = [firstNameG, lastNameG, apartmentG, yearG, makeG, modelG, lpG, lpStateG]
    for (let i = 0; i < guestInputs.length; i ++) {
        if (guestInputs[i].value == "") {
            alert(`All fields must be completed`);
            return;
        }
    }
    let guestObject = {
        "firstNameG" : firstNameG.value,
        "lastNameG" : lastNameG.value, 
        "apartmenG" : apartmentG.value, 
        "yearG" : yearG.value,
        "makeG" : makeG.value,
        "modelG" : modelG.value,
        "lpG" : lpG.value,
        "lpStateG" : lpStateG.value,
        "guestSpace" : spaceNum
    };
    addGuestRTDB(guestObject, firstNameG.value, lastNameG.value, apartmentG.value, spaceNum);
    reserve(spaceNum, popupContainer);
}

function addGuestRTDB(guestObject, firstNameG, lastNameG, apartmentG, spaceNum) {
    let firstLastG = (firstNameG + lastNameG).toLowerCase()
    set(ref(database, userLocationInDB + "/guestData/" + firstLastG), guestObject)
    .then(() => {
        alert(`Guest ${firstNameG} ${lastNameG} visiting ${apartmentG} added successfully!`)
    })
    .catch((error) => {
        alert("Error setting guest info: ", error);
    });
    set(ref(database, userLocationInDB + "/guestData/reservedSpaces/" + spaceNum), true)
    .then(() => {
        console.log("space reserved")
    })
    .catch((error) => {
        alert("Error setting guest info: ", error);
    })
}

function reserve(spaceNum, popupContainer) {
    guestParkingList[spaceNum].innerText = "Reserved"
    guestParkingList[spaceNum ].style.background = "rgb(151,129,60)"
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
})};

