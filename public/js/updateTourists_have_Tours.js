/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let updateTourists_have_ToursForm = document.getElementById('update-tourists_have_Tours-form-ajax');

// Modify the objects we need
updateTourists_have_ToursForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdTourists_have_Tours    = document.getElementById("dropDownIDTouristAssignmentSelect-update");
    let inputIdTourist                = document.getElementById("dropdownidTouristFullNameSelect-update");

    // Get the values from the form fields
    let idTourists_have_ToursValue    = inputIdTourists_have_Tours.value;
    let idTouristValue                = inputIdTourist.value;
    
    // Check for Null
    if (isNaN(idTourists_have_ToursValue)) 
    {
        console.log("No Tourist Assignment ID value");
        return;
    }

    if (isNaN(idTouristValue)) 
    {
        console.log("No Tourist ID value");
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        idTourists_have_Tours: idTourists_have_ToursValue,
        idTourist: idTouristValue,
    }
    
    data = JSON.stringify(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tourists_have_Tours-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Add the new data to the table
            updateRow(xhttp.response, idTourists_have_ToursValue);
            inputIdTourists_have_Tours.value = null;
            inputIdTourist.value = null;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(data);
})

function updateRow(data, idTourists_have_ToursValue){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("tourists_have_Tours-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idTourists_have_ToursValue) {
            let updateRowIndex      = table.getElementsByTagName("tr")[i];
            let tdTourist           = updateRowIndex.getElementsByTagName("td")[2];
            let touristFullName     = parsedData[0].firstName + ' ' + parsedData[0].middleName + ' ' +  parsedData[0].lastName;
            tdTourist.innerHTML     = touristFullName; 
       }
    }
}
