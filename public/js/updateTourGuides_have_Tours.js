/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let updateTourGuides_have_ToursForm = document.getElementById('update-tourGuides_have_Tours-form-ajax');

// Modify the objects we need
updateTourGuides_have_ToursForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdTourGuides_have_Tours    = document.getElementById("dropDownIDTourGuideAssignmentSelect-update");
    let inputIdTourGuide                = document.getElementById("dropdownidTourGuideFullNameSelect-update");

    // Get the values from the form fields
    let idTourGuides_have_ToursValue    = inputIdTourGuides_have_Tours.value;
    let idTourGuideValue                = inputIdTourGuide.value;
    
    // Check for Null
    if (isNaN(idTourGuides_have_ToursValue)) 
    {
        console.log("No Tour Guide Assignment ID value");
        return;
    }

    if (isNaN(idTourGuideValue)) 
    {
        console.log("No Tour Guide ID value");
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        idTourGuides_have_Tours: idTourGuides_have_ToursValue,
        idTourGuide: idTourGuideValue,
    }
    
    data = JSON.stringify(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tourGuides_have_Tours-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Add the new data to the table
            updateRow(xhttp.response, idTourGuides_have_ToursValue);
            inputIdTourGuides_have_Tours.value = null;
            inputIdTourGuide.value = null;
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(data);
})

function updateRow(data, idTourGuides_have_ToursValue){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("tourGuides_have_Tours-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idTourGuides_have_ToursValue) {
            let updateRowIndex      = table.getElementsByTagName("tr")[i];
            let tdTourGuide         = updateRowIndex.getElementsByTagName("td")[2];
            let middleName = '';
            if (parsedData[0].middleName != null){
                middleName = parsedData[0].middleName;
            }
            let tourGuideFullName   = parsedData[0].firstName + ' ' + middleName + ' ' +  parsedData[0].lastName;
            tdTourGuide.innerHTML   = tourGuideFullName; 
       }
    }
}
