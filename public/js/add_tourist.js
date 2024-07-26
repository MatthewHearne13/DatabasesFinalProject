/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addTouristForm = document.getElementById('add-tourist-form-ajax');

// Modify the objects we need
addTouristForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("input-firstName");
    let inputMiddleName = document.getElementById("input-middleName");
    let inputLastName = document.getElementById("input-lastName");
    let inputToursAttended = document.getElementById("input-toursAttended");
    let inputEmail = document.getElementById("input-email");
    let inputPhoneNumber = document.getElementById("input-phoneNumber");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let middleNameValue = inputMiddleName.value;
    let lastNameValue = inputLastName.value;
    let toursAttendedValue = inputToursAttended.value;
    let emailValue = inputEmail.value;
    let phoneNumberValue = inputPhoneNumber.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        middleName: middleNameValue,
        lastName: lastNameValue,
        toursAttended: toursAttendedValue,
        email: emailValue, 
        phoneNumber: phoneNumberValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tourist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputMiddleName.value = '';
            inputLastName.value = '';
            inputToursAttended.value = '';
            inputEmail.value = '';
            inputPhoneNumber.value = '';
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("tourist-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let middleNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let toursAttendedCell = document.createElement("TD");
    let emailCell = document.createElement("TD");
    let phoneNumberCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idTourist;
    firstNameCell.innerText = newRow.firstName;
    middleNameCell.innerText = newRow.middleName;
    lastNameCell.innerText = newRow.lastName;
    toursAttendedCell.innerText = newRow.toursAttended;
    emailCell.innerText = newRow.email;
    phoneNumberCell.innerText = newRow.phoneNumber;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTourist(newRow.idTourist);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(middleNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(toursAttendedCell);
    row.appendChild(emailCell);
    row.appendChild(phoneNumberCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idTourist);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("dropdownTouristNameSelect");
    let option = document.createElement("option");
    option.text = newRow.firstName + ' ' + newRow.middleName + ' ' +  newRow.lastName;
    option.value = newRow.idTourist;
    selectMenu.add(option);
    // End of new step 8 code.
}