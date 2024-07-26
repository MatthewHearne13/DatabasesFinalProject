/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
// Get the objects we need to modify
let updateTouristForm = document.getElementById('update-tourist-form-ajax');

// Modify the objects we need
updateTouristForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFullName = document.getElementById("dropdownTouristNameSelect");
    let inputToursAttended = document.getElementById("input-toursAttended-update");
    let inputEmail = document.getElementById("input-email-update");
    let inputPhoneNumber = document.getElementById("input-phoneNumber-update");

    // Get the values from the form fields
    let fullNameValue = inputFullName.value;
    let inputToursAttendedValue = inputToursAttended.value;
    let inputEmailValue = inputEmail.value;
    let inputPhoneNumberValue = inputPhoneNumber.value;

    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    if (isNaN(inputToursAttendedValue)) 
    {
        console.log("No Tours Attended Value");
        return;
    }
    if (inputEmailValue == "" || inputEmailValue == null) 
    {
        console.log("No Email Value");
        return;
    }
    if (inputPhoneNumberValue == "" || inputPhoneNumberValue == null) 
    {
        console.log("No Phone Number Value")
        return;
    }


    // Put our data we want to send in a javascript object
    let data = {
        fullname: fullNameValue,
        toursAttended: inputToursAttendedValue,
        email: inputEmailValue,
        phoneNumber: inputPhoneNumberValue,
    }
    
    data = JSON.stringify(data);
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-tourist-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            console.log(xhttp.response);
            // Add the new data to the table
            updateRow(xhttp.response, fullNameValue);
            inputFullName.value = null;
            inputToursAttended.value = '';
            inputEmail.value = '';
            inputPhoneNumber.value = '';

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(data);
})


function updateRow(data, idTourist){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("tourist-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idTourist) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of toursAttended value
            let tdToursAttended = updateRowIndex.getElementsByTagName("td")[4];
            // Get td of email value
            let tdEmail = updateRowIndex.getElementsByTagName("td")[5];
            // Get td of phoneNumber value
            let tdPhoneNumber = updateRowIndex.getElementsByTagName("td")[6];
            

            // Reassign homeworld to our value we updated to
            tdToursAttended.innerHTML = parsedData[0].toursAttended; 
            tdEmail.innerHTML = parsedData[0].email;
            tdPhoneNumber.innerHTML = parsedData[0].phoneNumber;
       }
    }
}


function autoFillTourist(event){

    let selectedidTourist = document.getElementById("dropdownTouristNameSelect");
    let selectedidTouristValue = selectedidTourist.value;

    let table = document.getElementById("tourist-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == selectedidTouristValue) {

            // Get the location of the row where we found the matching person ID
            let selectRowIndex = table.getElementsByTagName("tr")[i];
            // Get td of toursAttended value
            let tdToursAttended = selectRowIndex.getElementsByTagName("td")[4];
            console.log(tdToursAttended);
            // Get td of email value
            let tdEmail = selectRowIndex.getElementsByTagName("td")[5];
            console.log(tdEmail);
            // Get td of phoneNumber value
            let tdPhoneNumber = selectRowIndex.getElementsByTagName("td")[6];
            console.log(tdPhoneNumber);
            

            let inputToursAttended = document.getElementById("input-toursAttended-update");
            let inputEmail = document.getElementById("input-email-update");
            let inputPhoneNumber = document.getElementById("input-phoneNumber-update");

            inputToursAttended.value = parseInt(tdToursAttended.innerText);
            inputEmail.value = tdEmail.innerText;
            inputPhoneNumber.value = tdPhoneNumber.innerText;

       }
    }

}