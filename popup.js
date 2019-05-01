// Update the relevant fields with the new data
/*function setDOMInfo(info) {
  console.log(info);
  console.log(parseJSON(info));
  /*if(info.finalResultData["Tealium"] !="undefined" && info.finalResultData["Tealium"] !=""){
    if (typeof info.finalResultData['Tealium'].badges !== "undefined" ){
      var tealiumBadgeArr =[];
      var tealiumObj = info.finalResultData['Tealium'].badges;
      tealiumBadgeArr = listAllProperties(tealiumObj);
      console.log("tealiumBadgeArr");
      console.log(tealiumBadgeArr);
      document.getElementById('total').textContent = tealiumBadgeArr;
    }
  }
*/
  //document.getElementById('inputs').textContent = info.inputs;
  //document.getElementById('buttons').textContent = info.buttons;
/*}

// Once the DOM is ready...
/*window.addEventListener('DOMContentLoaded', function () {
  // ...query for the active tab...
  debugger;
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},function(response){
          console.log('i m here');
          console.log(response.response);
        });
  });
});
*/
//new ways

// Function to create tables based on array input
function createTable(id,arr){
  var table = document.createElement('table');
  for (var i = 0; i < arr.length; i++){
    var tr = document.createElement('tr');
    var td1 = document.createElement('td');
    var td2 = document.createElement('td');
    var td3 = document.createElement('td');
    var text1 ='';
    var text2 ='';
    var text3 ='';
    if(id == 'pas-data'){
      text1 = document.createTextNode(arr[i].AttributeName);
      text2 = document.createTextNode(arr[i].AttributeValue);
    } else if(id == 'ecomid-data'){
      text1 = document.createTextNode('Ecomm Id');
      text2 = document.createTextNode(arr[i]);
    } else if(id == 'ca-data'){
      text1 = document.createTextNode(arr[i][0]);
      text2 = document.createTextNode(arr[i][1]);
    } else if(id == 'optly-data'){
      var arrSplit = arr[i].split(":");
      text1 = document.createTextNode(arrSplit[0]);
      // Check for experiment
      if (arrSplit.length > 2) {
        text2 = document.createTextNode(arrSplit[1]);
        text3 = document.createTextNode(arrSplit[2]);
      // If no experiment vallue, print variation
      } else {
        text2 = document.createTextNode("n/a");
        text3 = document.createTextNode(arrSplit[1]);
      }
    } else {
      text1 = document.createTextNode(arr[i]);
    }
    td1.appendChild(text1);
    tr.appendChild(td1);
    // if text 2 doesn't exist don't append td2
    if (text2 != "") {
      td2.appendChild(text2);
      tr.appendChild(td2);
    }
    // if text 3 doesn't exist don't append td3
    if (text3 != "") {
      td3.appendChild(text3);
      tr.appendChild(td3);
    }
    table.appendChild(tr);
  }
  var parent = document.getElementById(id);
  parent.appendChild(table);
}

// Gets data from window and calls table generating function
function setup(){
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
    createTable('tealium-data',tealBadgeIDArr);
  }
  if(pasArr.length > 0 && pasArr !== ''){
    createTable('pas-data',pasArr);
  }
  if(customerAttributes.length > 0 && tealBadgeIDArr !== ''){
    createTable('ca-data',customerAttributes);
  }
  if(ecomid !== ''){
    createTable('ecomid-data',ecomid);
  }
  if(optly !== ''){
    createTable('optly-data',optly);
  }
}

window.addEventListener('DOMContentLoaded', function () {
  setup();
});
