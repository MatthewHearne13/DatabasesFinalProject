/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteLocationType(idLocationType) {
    let link = '/delete-locationType/';
    let data = {
      id: idLocationType
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRowLocationType(idLocationType);
      }
    });
  }

  
  function deleteRowLocationType(idLocationType){
      let table = document.getElementById("locationType-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].cells[0].innerText == idLocationType) {
              table.deleteRow(i);
              deleteDropDownMenu(idLocationType);
              break;
         }
      }
  }

  function deleteDropDownMenu(idLocationType){
    let selectMenu = document.getElementById("dropdownLocationTypeSelect-update");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(idLocationType)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }