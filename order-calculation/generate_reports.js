function gen_reps_from_menu() {
  var d = new Date();
  var d1;
  var d2;  
  
  d1 = Utilities.formatDate(d, time_zone, "yyyy-MM-dd");
  d2 = Utilities.formatDate(d, time_zone, "HH:mm:ss");
  
  generate_reports(d1, d2)
}


function generate_reports(d1, d2) {
  var actual_order = orderSheet.getRange("H4").getValue()
  
  if (actual_order === 0) {
    throw "The master order is blank. All the quantities are 0. Run the calculator first"
  }
  
  
  init()
  
  orderSheet.getRange("B1").setValue("USD")
  currency_routine()
  
  
  
  
  generate_report_1(d1, d2)
  generate_report_2(d1, d2)
  generate_report_3(d1, d2)
}


function generate_report_1(d1, d2) {
  init()
  //Insert the sheet  
  var sheet_rep = orderSheet.copyTo(spreadsheet)
  
  sheet_rep.getRange(2,1,10,3).clear()
  
  var rows = [ ["Productwise summary", ""], ["Date of Order: ", d1], ["Time of Order: ", d2]]
  sheet_rep.getRange(3,1,3,2).setValues(rows)
  sheet_rep.getRange('A1:B3').setFontWeight('bold');
  
  rows = [["Total Order Value", "Order Profit", "Margin %"]]
  sheet_rep.getRange(7,1,1,3).setValues(rows)
  var range_dst = sheet_rep.getRange("A8:A9")
  sheet_rep.getRange("H4:H5").copyTo(range_dst)
  
  range_dst = sheet_rep.getRange("B8:B9")
  sheet_rep.getRange("H6:H7").copyTo(range_dst)
  
  
  range_dst = sheet_rep.getRange("C8")
  sheet_rep.getRange("F2").copyTo(range_dst)
  sheet_rep.getRange("C8:C9").merge()
  
  
  var range_tmp = sheet_rep.getRange("A7:C7")
  range_tmp.setFontWeight('bold');
  range_tmp.setBorder(true, true, true, true, true, true);
  range_tmp.setHorizontalAlignment("center")
  range_tmp.setVerticalAlignment("middle");
  
  
  //Delete the empty rows
  var max_col = sheet_rep.getLastColumn()
  var last_row = sheet_rep.getLastRow()
  var tot_qtys = sheet_rep.getRange(start, max_col - 3, last_row - 16 + 1, 1).getValues()
  for(i = last_row; i >= start ; i--) {
    if (tot_qtys[i-start][0] === 0 || tot_qtys[i-start][0] === "")
      sheet_rep.deleteRow(i)
  } 
  
  
  /*******************************************************
  /* It does not work, because the total columns must be fixed
  **********************/
  //Delete the empty orders and corresponding vendors
  var orders_to_delete = [], vendors_to_delete = []
  var k, key
  var tot_qty
  SpreadsheetApp.flush()
  last_row = sheet_rep.getLastRow()
  for (k = vendors_keys.length-1; k >= 0; k--) {
    key = vendors_keys[k]
    tot_qty = sheet_rep.getRange(last_row, orders[key]).getValue()
    if(tot_qty == 0) {
      orders_to_delete.push(orders[key])
      vendors_to_delete.push(vendors_orig[key])
    }    
  }
  for(k = 0; k < orders_to_delete.length; k++) {
    sheet_rep.hideColumns(orders_to_delete[k], 4)
  }
  

  /*********************************************************/
  
  
  //Remove the Vlookup for prices and put copies instead  
  var curr_cell = sheet_rep.getRange("B1")
  var i
  for( key in vendors_orig) {
    curr_cell.setValue(sheet_rep.getRange(label_row + 2, vendors_orig[key]).getValue())
    range_tmp = sheet_rep.getRange(start, vendors_orig[key], last_row - 1 - start + 1, 1)
    rows = range_tmp.getValues()
    Logger.log(rows)
    for(i = 0; i < rows.length; i++) {
      if(rows[i][0] !== "") {
        rows[i][0] = "=" + rows[i][0] + "*" + get_col_lett(vendors_orig[key]) + "$" + (label_row + 3) + "/$C$1"
      }
    }
    range_tmp.setValues(rows)    
  }
  
  //Rename the sheet
  sheet_rep.setName("Productwise Report " + d1 + " at " + d2)
  sheet_rep.setTabColor(null)
  
  //Keep the column Q  values
  range_tmp = sheet_rep.getRange(start, first_vendor - 1, last_row - start + 1, 1)
  range_tmp.copyValuesToRange(sheet_rep, first_vendor - 1, first_vendor - 1, start, last_row)
  
  //keep the currencies of the vendors
  range_tmp = sheet_rep.getRange(label_row + 2, first_vendor, 1, vendors_keys.length)
  range_tmp.copyValuesToRange(sheet_rep, first_vendor, first_vendor +  vendors_keys.length - 1, label_row + 2, label_row + 2)

  //Remove the VLOOKUP of the market price and base cose and keep only the values
  range_tmp = sheet_rep.getRange(start, names_dict["Market Price"], last_row - start + 1, 1)
  rows = range_tmp.getValues()
  for(i = 0; i < rows.length; i++) {
      if(rows[i][0] !== "") {
        rows[i][0] = "=" + rows[i][0] + "/$C$1"
      }
  }
  range_tmp.setValues(rows)
  
  range_tmp = sheet_rep.getRange(start, names_dict["Base Cost"], last_row - start + 1, 1)
  rows = range_tmp.getValues()
  for(i = 0; i < rows.length; i++) {
      if(rows[i][0] !== "") {
        rows[i][0] = "=" + rows[i][0] + "/$C$1"
      }
  }
  range_tmp.setValues(rows)
  
  //Give it shape
  sheet_rep.getRange("D1:P11").clear()
  //Hide the vendors
  sheet_rep.hideColumns(first_vendor-1, vendors_keys.length+1)
  //shape to the last row
  sheet_rep.getRange(last_row, 1, 1, first_order-1).clear()
  sheet_rep.getRange(last_row, 1, 1, first_order-1).setBackground("yellow")
  
  sheet_rep.getRange("P" + last_row).setValue("Total:")
  sheet_rep.getRange("P" + last_row).setFontWeight('bold');
  
  
  
  
  sheet_rep.deleteColumn(get_col_num("O"))
  sheet_rep.deleteColumn(get_col_num("N"))
  sheet_rep.deleteColumn(get_col_num("M"))
  sheet_rep.deleteColumn(get_col_num("K"))
  sheet_rep.deleteColumn(get_col_num("J"))
  sheet_rep.deleteColumn(get_col_num("I"))
  sheet_rep.deleteColumn(get_col_num("E"))
  
  sheet_rep.getRange(start, 3, last_row - start + 1, 2).setDataValidation(null)
  
  //Hide the rows we between the label row and the start of the products
  sheet_rep.hideRows(label_row + 1, 4)
  
  
}









