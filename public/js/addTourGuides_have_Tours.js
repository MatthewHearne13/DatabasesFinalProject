/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let addTourGuides_have_ToursForm = document.getElementById('add-tourGuides_have_Tours-form-ajax');

// Modify the objects we need
addTourGuides_have_ToursForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdTourGuide= document.getElementById("dropdownidTourGuideSelect");
    let inputIdTourSelect = document.getElementById("dropDownIDTourSelect");
    let inputIdTourGuideName = inputIdTourGuide.options[inputIdTourGuide.selectedIndex].text;

    // Get the values from the form fields
    let idTourGuideValue = inputIdTourGuide.value;
    let idTourValue = inputIdTourSelect.value;
    let idTourGuideNameValue = inputIdTourGuideName.value;
    console.log(idTourGuideNameValue);
   

    // Put our data we want to send in a javascript object
    let data = {
        idTourGuide: idTourGuideValue,
        idTour: idTourValue,
        idTourGuideName: idTourGuideNameValue
    }
    console.log(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-tourGuides_have_Tours-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction
            inputIdTourGuide.value = null;
            inputIdTourSelect.value = null;
            
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
    let currentTable = document.getElementById("tourGuides_have_Tours-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let idTourCell = document.createElement("TD");
    let tourGuideNameCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idTourGuides_have_Tours;
    idTourCell.innerText = newRow.idTour;
    let middleName = '';
    if (newRow.middleName != null){
        middleName = newRow.middleName;
    }
    
    tourGuideNameCell.innerText = newRow.firstName + ' ' +  middleName + ' ' + newRow.lastName;
    dateCell.innerText = newRow.date;
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteTourGuides_have_Tours(newRow.idTourGuides_have_Tours);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(idTourCell);
    row.appendChild(tourGuideNameCell);
    row.appendChild(dateCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.idTourGuides_have_Tours);
    
    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("dropDownIDTourGuideAssignmentSelect-update");
    let option = document.createElement("option");
    option.text = newRow.idTourGuides_have_Tours;
    option.value = newRow.idTourGuides_have_Tours;
    selectMenu.add(option);

}