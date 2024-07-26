/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let updateTourForm = document.getElementById('update-tour-form-ajax');

// Modify the objects we need
updateTourForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputIdTour = document.getElementById("dropDownIDTourSelect-update");
    let inputNumOfTourist = document.getElementById("input-tour-numTourist-update");
    let inputDate = document.getElementById("input-date-update");
    //let inputIdLocation = document.getElementById("dropdownLocationAddressSelect");

    // Get the values from the form fields
    let idTourValue = inputIdTour.value;
    let numOfTouristValue = inputNumOfTourist.value;
    let dateValue = inputDate.value;
    //let idLocationValue = inputIdLocation.value;

    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    if (isNaN(idTourValue)) 
    {
        console.log("No Tour ID value");
        return;
    }

    if (isNaN(numOfTouristValue)) 
    {
        console.log("No number of tourists value");
        return;
    }

    if (dateValue == "" || dateValue == null) 
    {
        console.log("No date value");
        return;
    }
   
    //if (isNaN(idLocationValue)) 
    //{
    //    console.log("No Location address value");
    //    return;
    //}


    // Put our data we want to send in a javascript object
    let data = {
        idTour: idTourValue,
        numberOfTourist: numOfTouristValue,
        date: dateValue,
        //idLocation: idLocationValue,
    }
    
    data = JSON.stringify(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tour-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Add the new data to the table
            updateRow(xhttp.response, idTourValue);
            inputIdTour.value = null;
            inputNumOfTourist.value = '';
            inputDate.value = null;
            //inputIdLocation.value = null;

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(data);
})


function updateRow(data, idTour){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("tour-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idTour) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of toursAttended value
            let tdNumberOfTourist = updateRowIndex.getElementsByTagName("td")[1];
            // Get td of email value
            let tdDate = updateRowIndex.getElementsByTagName("td")[2];
            // Get td of phoneNumber value
            //let tdIdLocation = updateRowIndex.getElementsByTagName("td")[3];
            

            // Reassign homeworld to our value we updated to
            tdNumberOfTourist.innerHTML = parsedData[0].numberOfTourist; 
            let newDateFormat = new Date(parsedData[0].date);

            tdDate.innerHTML = newDateFormat.toISOString().split('T')[0];//new Date(parsedData[0].date.toISOString().split('T')[0]);//////////////
            //tdIdLocation.innerHTML = parsedData[0].idLocation;
       }
    }
}


function autoFillTour(event){

    let selectedidTour = document.getElementById("dropDownIDTourSelect-update");
    let selectedidTourValue = selectedidTour.value;

    console.log(selectedidTourValue)
    let table = document.getElementById("tour-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == selectedidTourValue) {

        console.log(table.rows[i]);
            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of toursAttended value
            let tdNumberOfTourist = updateRowIndex.getElementsByTagName("td")[1];
            console.log(tdNumberOfTourist);
            // Get td of email value
            let tdDate = updateRowIndex.getElementsByTagName("td")[2];
            console.log(tdDate);
            // Get td of phoneNumber value
            //let tdIdLocation = updateRowIndex.getElementsByTagName("td")[3];
            //console.log(tdIdLocation);

            let inputNumberOfTourist = document.getElementById("input-tour-numTourist-update");
            let inputDate = document.getElementById("input-date-update");
            //let inputIdLocation = document.getElementById("dropdownLocationAddressSelect-update");

            inputNumberOfTourist.value = parseInt(tdNumberOfTourist.innerText);
            inputDate.value = tdDate.innerText;
            //inputIdLocation.value = parseInt(tdIdLocation.value);

       }
    }

}