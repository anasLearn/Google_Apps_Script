function hide_columns_button(start_label, end_label) {
  var ss = SpreadsheetApp.getActive(); // the whole file (the whole spreadsheet)
  var sheet = ss.getActiveSheet()
  var first_row = sheet.getRange("A1:ZZ1").getValues()  
  var col_start = 0, col_end = 0  //The start and end of the columns we want to hide  
  var j
  
  first_row = first_row[0]
  for(j=0; j<first_row.length; j++) {
    if(first_row[j] == start_label) {
      col_start = j+1
      continue
    }
    
    if(first_row[j] == end_label) {
      col_end = j+1
      break
    }
  }
  
  sheet.hideColumns(col_start, col_end - col_start + 1)
}


function hide_warehouses_qtys() {
  hide_columns_button("#WRHS_QTYS", "#END_WRHS_QTYS")
}