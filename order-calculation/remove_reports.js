function rm_reports() {
  var sheets = spreadsheet.getSheets();
  var l
  var sheet
  
  
  Logger.log(sheets)
  
  for (l = sheets.length-1; l >= 0; l--) {
    sheet = sheets[l]
    Logger.log(sheet)
    Logger.log(sheets)
    if ( similar_sheet(sheet, "Productwise Report ") ) {
      spreadsheet.deleteSheet(sheet)
    }
    
    else if ( similar_sheet(sheet, "Makewise Report ") ) {
      spreadsheet.deleteSheet(sheet)
    }
    
    else if ( similar_sheet(sheet, "Summary Report ") ) {
      spreadsheet.deleteSheet(sheet)
    }
    
    else if ( similar_sheet(sheet, "Orders of ") ) {
      spreadsheet.deleteSheet(sheet)
    }
    
  }
  
}


function similar_sheet(sheet, model_name) {
  var i = 0;
  var test_txt = sheet.getName()
  for(i = 0; i < model_name.length; i++) {
    if( test_txt[i] !== model_name[i] ) {
      return false;
    }
  }
  
  
  return true;
}