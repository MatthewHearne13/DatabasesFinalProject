/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/


// Get the objects we need to modify
let updateTourGuideForm = document.getElementById('update-tourGuide-form-ajax');

// Modify the objects we need
updateTourGuideForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIDTourGuide = document.getElementById("dropdownTourGuideSelect-update");
    let inputBaseLocation = document.getElementById("dropdownbaseLocationSelect-update");   
    let inputFirstName = document.getElementById("input-tourGuide-firstName");
    let inputMiddleName = document.getElementById("input-tourGuide-middleName");
    let inputLastName = document.getElementById("input-tourGuide-lastName");
    let inputYearsAsGuide = document.getElementById("input-tourGuide-yearsAsGuide");
    let inputHourlyRate = document.getElementById("input-tourGuide-hourlyRate");

    // Get the values from the form fields
    let idTourGuideValue = inputIDTourGuide.value;
    console.log(idTourGuideValue);
    let baseLocationValue = inputBaseLocation.value;  
    let firstNameValue = inputFirstName.value;
    let middleNameValue = inputMiddleName.value;
    let lastNameValue = inputLastName.value;
    let yearsAsGuideValue = inputYearsAsGuide.value;
    let hourlyRateValue = inputHourlyRate.value;       
    
    // Put our data we want to send in a javascript object
    let data = {
        idTourGuide: idTourGuideValue,
        baseLocation: baseLocationValue,
        firstName: firstNameValue,
        middleName: middleNameValue,
        lastName: lastNameValue,
        yearsAsGuide: yearsAsGuideValue,  
        hourlyRate: hourlyRateValue,      
    }
    
    data = JSON.stringify(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tourGuide-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Add the new data to the table
            updateRow(xhttp.response, idTourGuideValue);
            inputIDTourGuide.value = '';
            inputBaseLocation.value = '';
            inputFirstName.value = '';
            inputMiddleName.value = '';
            inputLastName.value = '';
            inputYearsAsGuide.value = '';
            inputHourlyRate.value = '';
            
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(data);
})

function updateRow(data, idTourGuide){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("tourGuide-table");
    console.log(parsedData)
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].cells[0].innerText == idTourGuide) {
            table.rows[i].cells[1].innerText = parsedData[0].address;
            table.rows[i].cells[2].innerText = parsedData[0].firstName;
            table.rows[i].cells[3].innerText = parsedData[0].middleName;
            table.rows[i].cells[4].innerText = parsedData[0].lastName;
            table.rows[i].cells[5].innerText = parsedData[0].yearsAsGuide;
            table.rows[i].cells[6].innerText = parsedData[0].hourlyRate;
       }
    }
}
