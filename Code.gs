var moment = Moment.moment;
moment.locale('fi-FI');

// ctrl+space intellisense
function doGet(e) {
    
  //return getVuorotFromSheet();
  
  try{
    //return HtmlService.createHtmlOutput('<b>Hello, worldi!</b>');
    var output = HtmlService.createTemplateFromFile('index');
    var html = output.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
    return html;
    
  }
  catch(e){
    return ContentService.createTextOutput(JSON.stringify({
      'error' : e
    })).setMimeType(ContentService.MimeType.JSON);
  }

}

function getVuorotFromSheet(){
  //return {"trackingid: " : 6, "status: " : true };
  var ss = SpreadsheetApp.openById("1FMbKMaKfiwFc8Jk4bDBd96VCaqPS1yMbHwhySR4sBVU");
  var sheet = ss.getSheetByName('Vuorot');
  
  
  var jo = {};
  var dataArray = [];
  var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
  
  for(var i = 0, l = rows.length; i < l; i++){
    var dataRow = rows[i];
    var record = {};
    record['id'] = dataRow[0];
    record['begin'] = moment(dataRow[1]).format("H:mm");
    record['end'] = moment(dataRow[2]).format("H:mm");
    record['reservations'] = dataRow[3];
    record['max'] = dataRow[4];
    
    dataArray.push(record);
  }
  
  return dataArray;
  
  /*
  jo.vuoro = dataArray;
  var result = JSON.stringify(jo);
  var final = ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.JSON);
  
  return final;
  Logger.log("Hello " + result);
  eeeeeeee
  */
  //return sheet.getS// {"trackingid: " : newId, "status: " : true };
}

function addReservationFail(data) {
  var p = addReservationDeep();
  //Promise.all([p(data)
  /*
    return new cPromisePolyfill.Promise (function ( resolve, reject ) {
      try {
        resolve (addReservationDeep(data));
      }
      
      catch (err) {
        Logger.log(err);
        reject (err);
      }
      
    });*/
}

function addReservation(data) {
  Logger.log(data);
  
  // {name=Falarier, agree=true, email=jukka.jokelainen@gmail.com}
  // Allow access by select addData function and run debug
  var ss = SpreadsheetApp.openById("1FMbKMaKfiwFc8Jk4bDBd96VCaqPS1yMbHwhySR4sBVU");
  var sheetVaraajat = ss.getSheetByName('Varaajat');
  var sheetVuorot = ss.getSheetByName('Vuorot');
  
  var vuoroRows = sheetVuorot.getRange(2, 1, sheetVuorot.getLastRow() - 1, sheetVuorot.getLastColumn()).getValues();
  
    for(var i = 0, l = vuoroRows.length; i < l; i++){
      var vuoroRow = vuoroRows[i];
      var vuoroId = vuoroRow[0];
      
      if(vuoroId == data.vuoro) {
        var reservations = vuoroRow[3];
        var max = vuoroRow[4];
        
        if(reservations < max){
          // row, column
          sheetVuorot.getRange(i + 2,4).setValue(reservations + 1);
        
          var holder = [data.name, data.email, data.vuoro];
          sheetVaraajat.appendRow(holder);
          
          SpreadsheetApp.flush();
          
          data.begin = moment(vuoroRow[1]).format("MMMM Do YYYY, h:mm");
          
          
          MailApp.sendEmail(data.email, "Saunavaraus Lapinlahden juhannukseen 2018", "Olet varannut vuoron nimellä " + data.name + " Sähköposti: " + data.email + " Vuoro nro: " + data.vuoro + " Vuoro alkaa " + data.begin);
          
          
          return data;
        }
      }
  }
  
  /*
  var sheet = ss.getSheetByName('Agree');
  var user = Session.getActiveUser().getEmail();
  var createdDate = Date();
  var newId = getRandom();
  var holder = [data.name, data.email, createdDate, newId, data.agree, user];
  */

}


function getRandom(){
  return (new Date().getTime()).toString(36);
}

function fillVuorot(){
  
  var ss = SpreadsheetApp.openById("1FMbKMaKfiwFc8Jk4bDBd96VCaqPS1yMbHwhySR4sBVU");
  var sheet = ss.getSheetByName('Vuorot');
  
  var session_length = 75;
  var pause_length = 10;
  var date = moment([2018, 5, 22]);
  
  var ses_start = date.clone().add(10, 'hours');
  var ses_end;
  var ses_next;
  var end = date.clone().add(20, 'hours');

  var i = 0;
  do{
    i++;
    ses_end = ses_start.clone().add(session_length, 'minutes');
    ses_next = ses_end.clone().add(pause_length, 'minutes');
    
    var holder = [i, ses_start.format(), ses_end.format(), 0, 12];
    sheet.appendRow(holder);
    
    ses_start = ses_next;
    
  } while(ses_start.clone().add(session_length, 'minutes').isBefore(end));
  
  
  //var hours = moment().hours(10);
  
  //Logger.log("Heeei aika on: " + start.format());
  //Logger.log("10 tuntia: " + hours.format());
//  var holder = 
}
