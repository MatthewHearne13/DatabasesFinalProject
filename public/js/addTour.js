/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addTourForm = document.getElementById('add-tour-form-ajax');

// Modify the objects we need
addTourForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputNumberOfTourists= document.getElementById("input-numberOfTourist");
    let inputDate = document.getElementById("input-date");
    let inputIDLocation = document.getElementById("dropdownLocationAddressSelect");
    let inputIDLocationAddress = inputIDLocation.options[inputIDLocation.selectedIndex].text;
    console.log(inputIDLocationAddress);

    // Get the values from the form fields
    let numberOfTouristsValue = inputNumberOfTourists.value;
    let dateValue = inputDate.value//inputDate.value;
    let idLocationValue = inputIDLocation.value;
    let inputIDLocationAddressValue = inputIDLocationAddress;

    // Put our data we want to send in a javascript object
    let data = {
        numberOfTourists: numberOfTouristsValue,
        date: dateValue,
        idLocation: idLocationValue,
        idLocationAddress: inputIDLocationAddressValue
    }
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tour-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction
            inputNumberOfTourists.value = '';
            inputDate.value = '';
            inputIDLocation.value = null;
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    data = JSON.stringify(data)
    // Send the request and wait for the response
    xhttp.send(data);

})


// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {


    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("tour-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let numberOfTouristsCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let idLocationCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");


    console.log(newRow);
    // Fill the cells with correct data
    idCell.innerText = newRow.idTour;
    numberOfTouristsCell.innerText = newRow.numberOfTourist;
    dateCell.innerText = new Date(newRow.date).toISOString().split('T')[0]; //newRow.date;
    idLocationCell.innerText = newRow.address;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTour(newRow.idTour);
    };
    console.log(newRow.numberOfTourists);
    console.log(numberOfTouristsCell.innerText)

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(numberOfTouristsCell);
    row.appendChild(dateCell);
    row.appendChild(idLocationCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idTour);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("dropDownIDTourSelect-update");
    let option = document.createElement("option");
    option.text = newRow.idTour;
    option.value = newRow.idTour;
    selectMenu.add(option);

    //let selectMenuUpdate = document.getElementById("dropDownIDTourSelect-update");
    //let optionUpdate = document.createElement("option");
    //optionUpdate.text = newRow.idTour;
    //optionUpdate.value = newRow.idTour;
    //selectMenuUpdate.add(optionUpdate);
    // End of new step 8 code.
}