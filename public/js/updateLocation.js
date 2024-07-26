/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

// Get the objects we need to modify
let updateLocationForm = document.getElementById('update-location-form-ajax');

// Modify the objects we need
updateLocationForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIDLocation = document.getElementById("dropdownLocationIDSelect");
    let inputAddress = document.getElementById("input-location-Address");
    let inputLocationType = document.getElementById("dropdownLocationTypeSelect-update");

    // Get the values from the form fields
    let idLocationValue = inputIDLocation.value;
    let AddressValue = inputAddress.value;
    let locationTypeValue = inputLocationType.value;

   
    // Put our data we want to send in a javascript object
    let data = {
        idLocation: idLocationValue,
        Address: AddressValue,
        locationType: locationTypeValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-location-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, idLocationValue);

            inputIDLocation.value = '';
            inputAddress.value = '';
            inputLocationType = null;

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, idLocation){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("location-table");
    console.log(parsedData)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerText == idLocation) {
            table.rows[i].cells[1].innerText = parsedData[0].address;
            table.rows[i].cells[2].innerText = parsedData[0].locationType;

       }
    }
}
