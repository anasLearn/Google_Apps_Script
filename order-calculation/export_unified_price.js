function export_unified() {
  var file_output_id = "1KZJ5dXS-99rycfTp1mbEWFTGKgzX-pxXasHnYCWF2CU"
  
  var unified_cost_sheet = SpreadsheetApp.getActive().getSheetByName("Unified Cost Price")
  var last_row = unified_cost_sheet.getLastRow()
  
  
  var output_file = SpreadsheetApp.openById(file_output_id)
  
  if(!output_file) {
    throw "The unified cost file does not exist, please contact the administator"
  }
  
  var sheet_tmp
  var currencies = ["AUD", "USD", "EUR", "GBP"]
  var k,m
  var ready = 0
  
  var range_src, range_dst
  var input_currency_cell = unified_cost_sheet.getRange("B2")
  
  var raw_sheet = output_file.getSheetByName("RAW")
  
  var last_col = raw_sheet.getLastColumn()
  
  var d = new Date();
  var d1 = Utilities.formatDate(d, time_zone, "yyyy-MM-dd");
  var d2 = Utilities.formatDate(d, time_zone, "HH:mm:ss");  
  
  
  //Columns to delete
  var cols_to_delete = []
  //Market price Vs. Sale Price = AL, AK, AJ
  cols_to_delete.push("AL", "AK", "AJ")
  //Quantity to consider: AG
  cols_to_delete.push("AG")
  //Extra quantities from all warehouses and also the total
  cols_to_delete.push("AE", "AC", "AB", "Z", "X", "W", "U", "S", "R", "P", "N", "M", "L", "K", "J", "I", "H")
  //Priority
  cols_to_delete.push("G")
  //Category
  cols_to_delete.push("E")
  
  
  //Making of the sheets of the currencies  
  for (k=0; k < currencies.length; k++) {
    sheet_tmp = output_file.getSheetByName(currencies[k])
    if (sheet_tmp) {
      sheet_tmp.clear();
      sheet_tmp.activate();
    } else {
      sheet_tmp = output_file.insertSheet(currencies[k], output_file.getNumSheets());
    }
  
    
    //Copy the data
    input_currency_cell.setValue(currencies[k])
    ready = 0
    while(ready === 0) {
      if(currencies[k] === raw_sheet.getRange("B1").getValue() ) {
        ready = 1
      }      
      SpreadsheetApp.flush()
    }
    
    Logger.log(raw_sheet.getRange("B1").getValue())
    Logger.log(currencies[k])
    
    
    range_src = raw_sheet.getRange(1, 1, last_row, last_col)
    range_dst = sheet_tmp.getRange(1, 1, last_row, last_col)
    range_dst.setValues(range_src.getValues())
    range_src.copyTo(range_dst, {formatOnly:true})
    
    
    /*
    //Copy the data
    //Set the currency
    input_currency_cell.setValue(currencies[k])
    range_src = unified_cost_sheet.getRange("A2:B2")
    range_dst = sheet_tmp.getRange("A1:B1")  
    range_dst.setValues(range_src.getValues())    
    
    
    range_src = unified_cost_sheet.getRange("A8:AH8")
    range_dst = sheet_tmp.getRange("A8:AH8")
    range_dst.setValues(range_src.getValues())
    
    range_src = unified_cost_sheet.getRange("AP7:AU8")
    range_dst = sheet_tmp.getRange("AI7:AN8")
    range_dst.setValues(range_src.getValues())
    
    range_src = unified_cost_sheet.getRange(10, 1, last_row-10, get_col_num("N"))
    range_dst = sheet_tmp.getRange(10, 1, last_row-10, get_col_num("N"))
    range_dst.setValues(range_src.getValues())
    
    range_src = unified_cost_sheet.getRange(10, get_col_num("V"), last_row-10, get_col_num("Z")-get_col_num("V")+1)
    range_dst = sheet_tmp.getRange(10, get_col_num("O"), last_row-10, get_col_num("Z")-get_col_num("V")+1)
    range_dst.setValues(range_src.getValues())
    
    //Fix the format
    range_src = raw_sheet.getRange("A4:S5")
    range_dst = sheet_tmp.getRange("A7:S8")
    range_src.copyTo(range_dst, {formatOnly:true})
    
    range_src = raw_sheet.getRange("A1:B2")
    range_dst = sheet_tmp.getRange("A1:B2")
    range_src.copyTo(range_dst, {formatOnly:true})
    
    */
    
    //Set the time
    sheet_tmp.getRange("A2:B2").setValues([["Update Time", d1 + " - " + d2]])
    
    //Delete Empty rows
    //sheet_tmp.deleteRow(9)
    //sheet_tmp.deleteRows(3, 3)
    
    /*
    //Fix the format of the rows
    range_src = raw_sheet.getRange("6:6")
    range_dst = sheet_tmp.getRange(6, 1, sheet_tmp.getLastRow()-5, sheet_tmp.getLastColumn())
    range_src.copyTo(range_dst, {formatOnly:true})
    */
    
    
    //Delete the extra columns
    for(m = 0; m < cols_to_delete.length; m++) {
      sheet_tmp.deleteColumn(get_col_num(cols_to_delete[m]))
    }
    
    
   
  }
  
                                            
  
}
