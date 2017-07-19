function getScriptUrl() {
  var url = ScriptApp.getService().getUrl();
  return url;
}

function doGet() {

  return HtmlService
      .createTemplateFromFile('Index')
      .evaluate(); 
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

// *****************  LEGGE I DATI DALLO SHEET E RESTITUISCE UN OBJECT  *************

function readData(){

var rows = sheet.getLastRow()-2
// Logger.log(rows);
var cols = sheet.getLastColumn()+1
// Logger.log(cols);
var headers = sheet.getRange(1,1,1,cols).getValues()
// Logger.log(headers)
var data = sheet.getRange(3,1,rows,cols).getValues()
// Logger.log(data)
var currentUser = Session.getActiveUser().getEmail()
// Logger.log(typeof(currentUser))
var indexEditor = '0'
// Logger.log(typeof(indexEditor))

var dataObjectsArray = [] //Object con un Array di Objects

for (var i=0; i<rows; i++){ // per ogni riga 
  
var dataObjects = {} // inizializza un object
  for (var j=0; j<cols; j++){ // per ogni colonna 
  Object.defineProperty(dataObjects, headers[0][j], { // ne definisce le proprietà usando i nomi di colonna 
    value: data[i][j], // e i valori usando i dati in tabella 
    writable: true,
    enumerable: true,
    configurable: true
    }); 
  }  

    // quando completa l'Object lo aggiunge all'array di Objects
 
      var existingDate = dataObjects['Data rilevazione'] 
      dataObjects['Data rilevazione'] = Utilities.formatDate(new Date(existingDate), "CET", "dd/MM/yyyy")
      dataObjectsArray.push(dataObjects)
      Logger.log(dataObjects);
 
}
  
// ---------------------------------------------
// controllo ruolo utente: viewer, editor, owner  
  
var filtro = dataObjectsArray.filter (function (el) {
  return (el['Account'] == currentUser)
  })

if (filtro.length > 0) {
    var indexEditor = 1
   }

// Logger.log(indexEditor)

// ---------------------------------------------
  
var mainObject = {  // quando completa l'array di Object costruisce l'oggetto Contenitore
      user: currentUser,
      indexEditor: indexEditor,
      sendHangout: dataObjectsArray['Account'],
      table: dataObjectsArray,
    };

  Logger.log(mainObject);
 return mainObject  // il risultato viene restituito come Object e non come JSON stringify 
}