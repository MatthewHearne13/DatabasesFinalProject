/*
    # Citation for the following file:
    # Date: 8/12/2023
    # Copied from and adapted from the node.js starter code:
    # Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app
*/

function deleteTourGuide(idTourGuide) {
    let link = '/delete-tourGuide/';
    let data = {
      idTourGuide: idTourGuide
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        deleteRow(idTourGuide);
      }
    });
  }
  
  function deleteRow(idTourGuide){
      let table = document.getElementById("tourGuide-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].cells[0].innerText == idTourGuide) {
              table.deleteRow(i);
              deleteDropDownMenu(idTourGuide);
              break;
         }
      }
  }

  function deleteDropDownMenu(idTourGuide){
    let selectMenu = document.getElementById("dropdownTourGuideSelect-update");
    for (let i = 0; i < selectMenu.length; i++){
      if (Number(selectMenu.options[i].value) === Number(idTourGuide)){
        selectMenu[i].remove();
        break;
      } 
  
    }
  }