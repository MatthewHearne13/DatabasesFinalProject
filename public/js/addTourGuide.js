/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addTourGuideForm = document.getElementById('add-tourGuide-form');

// Modify the objects we need
addTourGuideForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    // let inputIDTour = document.getElementById("input-idTour")
    let inputbaseLocation = document.getElementById("dropdownbaseLocationSelect");
    let inputfirstName = document.getElementById("input-firstName");
    let inputmiddleName = document.getElementById("input-middleName");
    let inputlastName = document.getElementById("input-lastName");
    let inputyearsAsGuide = document.getElementById("input-yearsAsGuide");
    let inputhourlyRate = document.getElementById("input-hourlyRate");

    // Get the values from the form fields
    
    let baseLocationtValue = inputbaseLocation.value;
    let firstNameValue = inputfirstName.value;
    let middleNameValue = inputmiddleName.value;
    let lastNameValue = inputlastName.value;
    let yearsAsGuideValue = inputyearsAsGuide.value;
    let hourlyRateValue = inputhourlyRate.value;

    // Put our data we want to send in a javascript object
    let data = {
        // idTour: idTourValue,
        baseLocation: baseLocationtValue,
        firstName: firstNameValue,
        middleName: middleNameValue,
        lastName: lastNameValue,
        yearsAsGuide: yearsAsGuideValue,
        hourlyRate: hourlyRateValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tourGuide-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            // inputIDTour.value = '';
            inputbaseLocation.value = null;
            inputfirstName.value = '';
            inputmiddleName.value = '';
            inputlastName.value = '';
            inputyearsAsGuide.value = '';
            inputhourlyRate.value = '';
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
    let currentTable = document.getElementById("tourGuide-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let baseLocationCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let middleNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let yearsAsGuideCell = document.createElement("TD");
    let hourlyRateCell = document.createElement("TD");

    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idTourGuide;
    baseLocationCell.innerText = newRow.address;
    firstNameCell.innerText = newRow.firstName;
    middleNameCell.innerText = newRow.middleName;
    lastNameCell.innerText = newRow.lastName;
    yearsAsGuideCell.innerText = newRow.yearsAsGuide;
    hourlyRateCell.innerText = '$' + newRow.hourlyRate;
    
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRow(newRow.idTourGuide);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(baseLocationCell);
    row.appendChild(firstNameCell);
    row.appendChild(middleNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(yearsAsGuideCell);
    row.appendChild(hourlyRateCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idTourGuide);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("dropdownTourGuideSelect-update");
    let option = document.createElement("option");
    option.text = newRow.firstName + ' ' + newRow.middleName + ' ' +   newRow.lastName;
    option.value = newRow.idTourGuide;
    selectMenu.add(option);
    // End of new step 8 code.
}
