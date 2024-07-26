/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteLocation(idLocation) {
    let link = '/delete-location/';
    let data = {
      id: idLocation
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRowLocation(idLocation);
      }
    });
  }

  
  function deleteRowLocation(idLocation){
      let table = document.getElementById("location-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].cells[0].innerText == idLocation) {
              table.deleteRow(i);
              deleteDropDownMenu(idLocation);
              break;
         }
      }
  }


  function deleteDropDownMenu(idLocation){
    let selectMenu = document.getElementById("dropdownLocationIDSelect");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(idLocation)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }