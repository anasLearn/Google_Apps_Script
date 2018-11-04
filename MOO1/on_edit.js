/*
function onEdit(e) {
  // Set a comment on the edited cell to indicate when it was changed.
  var edited_range = e.range;
  
  var range_tmp
  
  //Case 1: currency change in the orderSheet
  range_tmp = orderSheet.getRange("B1")
  if (equal_ranges(range_tmp, edited_range)) {
    currency_routine()
    return
  }
  
  
  //Case 2: currency change in the generated order
  if (similar_range(edited_range, "Orders of ", "G5")) {
    currency_routine()
    return
  }
  
  
  //Case 3: changes in the Data 3 sheet
  range_tmp = data3Sheet.getRange("A1:E1")
  if (equal_range_sheets(edited_range, range_tmp)) {
    sheet_update_routine(range_tmp)
    return
  }
  
  //Case 4: changes in the "Vendors Prices" sheet
  range_tmp = vendorsPricesSheet.getRange("A1:E1")
  if (equal_range_sheets(edited_range, range_tmp)) {
    sheet_update_routine(range_tmp)
    return
  }
  
  //Case 5: Changes in the productwise report
  if (similar_range(edited_range, "Productwise Report", "B1")) {
    currency_routine()
    return
  }
  
  //Case 6: currency change in the makewise report
  if (similar_range(edited_range, "Makewise Report ", "B1")) {
    currency_routine()
    return
  }
  
  //Case 7: currency change in the summary report
  if (similar_range(edited_range, "Summary Report ", "B1")) {
    currency_routine()
    return
  }
}
*/



function currency_routine() {
  var txt;
  var tmp = orderSheet.getRange("B4:B5").getValues()
  
  txt = "The currency rates were last updated by "
  txt += tmp[1][0] + " on "
  txt += tmp[0][0] + " \n\n"
  txt += "Would you like to update them now?"
  
  response = ui.alert(txt, ui.ButtonSet.YES_NO);
  if (response == ui.Button.YES) {
        update_rates();
  }
}



function sheet_update_routine(range) {
  var d = new Date();
  var d1;
  var d2;
  var txt;
  
  d1 = Utilities.formatDate(d, time_zone, "yyyy-MM-dd");
  d2 = Utilities.formatDate(d, time_zone, "HH:mm:ss");
  
  row = []
  
  row.push("Last Update Time:")
  row.push(d1 + " at " + d2)
  row.push("")
  row.push("Updated By:")
  row.push(Session.getActiveUser().getEmail())
  
  row = [row]
  
  range.setValues(row)
  
}

