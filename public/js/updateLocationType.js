/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateLocationTypeForm = document.getElementById('update-locationType-form-ajax');

// Modify the objects we need
updateLocationTypeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIDLocationType = document.getElementById("dropdownLocationTypeSelect-update");
    let inputLocationType = document.getElementById("input-locationType-update");
    let inputDescription = document.getElementById("input-locationType-description-update");

    // Get the values from the form fields
    let idLocationTypeValue = inputIDLocationType.value;
    let LocationTypeValue = inputLocationType.value;
    let DescriptionValue = inputDescription.value;
    
   
    // Put our data we want to send in a javascript object
    let data = {
        idLocationType: idLocationTypeValue,
        locationType: LocationTypeValue,
        description: DescriptionValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-locationType-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idLocationTypeValue);

            inputIDLocationType.value = null;
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


function updateRow(data, idLocationType){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("locationType-table");
    console.log(parsedData)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerText == idLocationType) {
            table.rows[i].cells[1].innerText = parsedData[0].locationType;
            table.rows[i].cells[2].innerText = parsedData[0].description;
       }
    }
}

