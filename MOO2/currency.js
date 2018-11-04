function update_rates() {
  //The UI
  ui = SpreadsheetApp.getUi();
  
  var spreadsheet = SpreadsheetApp.getActive();
  var cuSheet = spreadsheet.getSheetByName('Currency');
  var orderSheet = spreadsheet.getSheetByName('Order Sheet');
  
  var last_row = cuSheet.getLastRow()
  
  var range_src = cuSheet.getRange(2, 2, 6)
  
  range_src.copyValuesToRange(cuSheet, 3, 3, 2, 7)
  
  var d = new Date();
  var d1;
  var d2;  
  
  d1 = Utilities.formatDate(d, time_zone, "yyyy-MM-dd");
  d2 = Utilities.formatDate(d, time_zone, "HH:mm:ss");
  
  orderSheet.getRange("B4").setValue(d1 + " at " + d2)
  orderSheet.getRange("B5").setValue(Session.getActiveUser().getEmail());
  
}



