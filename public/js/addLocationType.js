/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let addLocationTypeForm = document.getElementById('add-locationType-form');

// Modify the objects we need
addLocationTypeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
  
    let inputLocationType = document.getElementById("input-locationType");
    let inputDescription = document.getElementById("input-description");
    

    // Get the values from the form fields
  
    let LocationTypeValue = inputLocationType.value;
    let DescriptionValue = inputDescription.value;
    

    // Put our data we want to send in a javascript object
    let data = {
        LocationType: LocationTypeValue,
        Description: DescriptionValue,
    }
    
    console.log(LocationTypeValue);
    console.log(DescriptionValue);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/add-locationType-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            // inputIDTour.value = '';
            inputLocationType.value = '';
            inputDescription.value = '';
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
    let currentTable = document.getElementById("locationType-table");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 4 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let LocationTypeCell = document.createElement("TD");
    let DescriptionCell = document.createElement("TD");
   
    let deleteCell = document.createElement("TD");

    // Fill the cells with correct data
    idCell.innerText = newRow.idLocationType;
    LocationTypeCell.innerText = newRow.locationType;
    DescriptionCell.innerText = newRow.description; 
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteRowLocationType(newRow.idLocationType);
    };



    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(LocationTypeCell);
    row.appendChild(DescriptionCell);
    row.appendChild(deleteCell);
    
    // Add a custom row attribute so the deleteRow function can find a newly added row
    row.setAttribute('locationType-value', newRow.idLocationType);

    // Add the row to the table
    currentTable.appendChild(row);

    // Start of new Step 8 code for adding new data to the dropdown menu for updating people
    
    // Find drop down menu, create a new option, fill data in the option (full name, id),
    // then append option to drop down menu so newly created rows via ajax will be found in it without needing a refresh
    let selectMenu = document.getElementById("dropdownLocationTypeSelect");
    let option = document.createElement("option");
    option.text = newRow.idLocationType;
    option.value = newRow.idLocationType;
    selectMenu.add(option);
    // End of new step 8 code.
}
