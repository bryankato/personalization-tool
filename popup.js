// Function to create tables based on array input
function fillTable(id,arr){
  var table = document.getElementById(id);
  for (var i = 0; i < arr.length; i++){
    var row = table.insertRow(i+1);
    var text1 ='';
    var text2 ='';
    var text3 ='';
    if(id == 'pas-data'){
      text1 = arr[i].AttributeName;
      text2 = arr[i].AttributeValue;
    } else if(id == 'ecomid-data'){
      text1 = 'Ecomm Id';
      text2 = arr[i];
    } else if(id == 'ca-data'){
      text1 = arr[i][0];
      text2 = arr[i][1];
    } else if(id == 'optly-data'){
      var arrSplit = arr[i].split(":");
      text1 = arrSplit[0];
      // Check for experiment
      if (arrSplit.length > 2) {
        text2 = arrSplit[1];
        text3 = arrSplit[2];
      // If no experiment vallue, print variation
      } else {
        text2 = "n/a";
        text3 = arrSplit[1];
      }
    } else {
      text1 = arr[i];
    }
    var cell1 = row.insertCell(0);
    cell1.innerText = text1;
    // if text 2 doesn't exist don't append td2
    if (text2 != "") {
      var cell2 = row.insertCell(1);
      cell2.innerText = text2;
    }
    // if text 3 doesn't exist don't append td3
    if (text3 != "") {
      var cell3 = row.insertCell(2);
      cell3.innerText = text3;
    }
  }
}

// Gets data from window and calls table generating function
function createProfile(){
  debugger;
  // Get values from window
  let tealBadgeID = chrome.extension.getBackgroundPage();
  // Assign obj to new vars
  let tealBadgeIDArr = tealBadgeID.teal;
  let pasArr = tealBadgeID.pas;
  let customerAttributes = tealBadgeID.customerAttributes;
  let ecomid = tealBadgeID.ecomid;
  let optly = tealBadgeID.optly;
  console.log(pasArr);
  console.log(tealBadgeIDArr);
  console.log(customerAttributes);
  console.log(ecomid);
  console.log(optly);
  // Generate tables with data
  if(tealBadgeIDArr.length > 0 && tealBadgeIDArr !== ''){
    fillTable('tealium-data',tealBadgeIDArr);
  }
  if(pasArr.length > 0 && pasArr !== ''){
    fillTable('pas-data',pasArr);
  }
  if(customerAttributes.length > 0 && tealBadgeIDArr !== ''){
    fillTable('ca-data',customerAttributes);
  }
  if(ecomid !== ''){
    fillTable('ecomid-data',ecomid);
  }
  if(optly !== ''){
    fillTable('optly-data',optly);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  createProfile();
});
