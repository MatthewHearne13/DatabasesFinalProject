/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/
function deleteTourists_have_Tours(idTourists_have_Tours) {
    // Put our data we want to send in a javascript object
    let data = {
      idTourists_have_Tours: idTourists_have_Tours
    };
  
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-tourists_have_Tours-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
  
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
  
            // Add the new data to the table
            deleteRow(idTourists_have_Tours);
  
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
  }
  
  
  function deleteRow(idTourists_have_Tours){
    let table = document.getElementById("tourists_have_Tours-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == idTourists_have_Tours) {
            table.deleteRow(i);
            deleteDropDownMenu(idTourists_have_Tours);
            break;
       }
    }
  }
  
  function deleteDropDownMenu(idTourists_have_Tours){
    let selectMenu = document.getElementById("dropDownIDTouristAssignmentSelect-update");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(idTourists_have_Tours)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }