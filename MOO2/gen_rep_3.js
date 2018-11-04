
//Makewise summary
function generate_report_3(d1, d2) {
  init()
  
  var range_tmp 
  var range_src, range_dst
  var last_row
  var i
  
  

  
  //Insert the sheet
  var sheet_name_rep3 = "Summary Report " + d1 + " " + d2
  var sheet_rep = spreadsheet.getSheetByName(sheet_name_rep3);
  if (sheet_rep) {
    sheet_rep.clear();
    sheet_rep.activate();
  } else {
    sheet_rep = spreadsheet.insertSheet(sheet_name_rep3, spreadsheet.getNumSheets());
  }
  
  
  //Fill the general info
  var rows
  rows = [ ["Executive Order Summary", ""], ["Date of Order: ", d1], ["Time of Order: ", d2]]
  sheet_rep.getRange(2,1,3,2).setValues(rows)
  sheet_rep.getRange('A2:B4').setFontWeight('bold');
  
  range_src = orderSheet.getRange("A1:C1")
  range_dst = sheet_rep.getRange("A1:C1")
  range_src.copyTo(range_dst)
  
  

  //Set the headers rows
  rows = [ ["", "Report Selection", "Order Value", "Achievement", ""], ["", "", "", "Value", "%"], ["Budget", "", "", "", ""], ["Target Profitability", "", "", "", ""]]
  
  range_tmp = sheet_rep.getRange(6, 1, 4, 5)
  range_tmp.setValues(rows)
   
  
  //Fill the first table
  orderSheet.getRange(budget_cell).copyValuesToRange(sheet_rep, 2, 2, 8, 8)
  orderSheet.getRange(budget_cell).copyFormatToRange(sheet_rep, 2, 2, 8, 8)
  
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 1).copyValuesToRange(sheet_rep, 3, 3, 8, 8)
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 1).copyFormatToRange(sheet_rep, 3, 3, 8, 8)
  
  orderSheet.getRange(profitability_cell).copyValuesToRange(sheet_rep, 2, 2, 9, 9)
  orderSheet.getRange(profitability_cell).copyFormatToRange(sheet_rep, 2, 2, 9, 9)
  
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 3).copyValuesToRange(sheet_rep, 4, 4, 9, 9)
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 3).copyFormatToRange(sheet_rep, 4, 4, 9, 9)
  
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 2).copyValuesToRange(sheet_rep, 5, 5, 9, 9)
  orderSheet.getRange(total_row, first_order + 4 * vendors_keys.length + 2).copyFormatToRange(sheet_rep, 5, 5, 9, 9)
  
   
  //Format the Headers of the first table
  range_tmp.setFontWeight('bold')
  range_tmp.setVerticalAlignment("middle")
  range_tmp.setHorizontalAlignment("center")
  range_tmp.setBorder(true, true, true, true, true, true)  
  sheet_rep.getRange("A6:C7").mergeVertically()
  sheet_rep.getRange("D6:E6").merge()
  
  
  
  
  //Fill the second Table Headers
  rows = [["Vendor", "Min Order Limit / Vendor", "Total Order Value", "Order Value Short", "Order Value Short %", "Total Order Quantity", "Total Order Margin", "Total Order Profit"]]
  range_tmp = sheet_rep.getRange("A12:H12")
  range_tmp.setValues(rows)
  
  //Format the second table Header
  range_tmp.setWrap(true)
  range_tmp.setFontWeight('bold')
  range_tmp.setVerticalAlignment("middle")
  range_tmp.setHorizontalAlignment("center")
  range_tmp.setBorder(true, true, true, true, true, true)
  sheet_rep.setRowHeight(12, 70)
  
  
  
  //Fill the data of the second table
  var sheet_rep_2 = spreadsheet.getSheetByName("Makewise Report " + d1 + " " + d2)
  

  
  //1st column
  range_src = sheet_rep_2.getRange(8, 1, number_active_vendors + 1, 1)
  range_dst = sheet_rep.getRange(13, 1, number_active_vendors + 1, 1)
  range_src.copyTo(range_dst)
  
  //2nd column
  rows = []
  for(var key in vendors) {
    rows.push( [orderSheet.getRange(label_row - 4, vendors[key]).getValue()] )    
  }
  
  range_dst = sheet_rep.getRange(13, 2, number_active_vendors, 1)
  range_dst.setValues(rows)
  
  //3rd column
  range_src = sheet_rep_2.getRange(8, 4 * available_makes.length + 3, number_active_vendors+1, 1)
  range_dst = sheet_rep.getRange(13, 3, number_active_vendors+1, 1)
  range_src.copyTo(range_dst) 
  
  //4th and 5th colum
  var short_formula = "=MAX(0, R[0]C[-2] - R[0]C[-1])"
  var short_percent_formula = '=iferror(R[0]C[-1] / R[0]C[-3])' 
  rows = []
  for(key in vendors) {
    rows.push([short_formula, short_percent_formula])
  }
  range_dst = sheet_rep.getRange(13, 4, number_active_vendors, 2)
  range_dst.setFormulasR1C1(rows) 
  
  //6th column
  range_src = sheet_rep_2.getRange(8, 4 * available_makes.length + 2, number_active_vendors+1, 1)
  range_dst = sheet_rep.getRange(13, 6, number_active_vendors+1, 1)
  range_src.copyTo(range_dst)
  
  //7th and 8th column: Order Margin + Order Profit
  range_src = sheet_rep_2.getRange(8, 4 * available_makes.length + 4, number_active_vendors+1, 2)
  range_dst = sheet_rep.getRange(13, 7, number_active_vendors+1, 2)
  range_src.copyTo(range_dst)
  
  
  //Implement the currency converter
  range_tmp = sheet_rep.getRange("B8:C8")
  rows = range_tmp.getValues()
  rows[0][0] = "=" + rows[0][0] + "/$C$1"
  rows[0][1] = "=" + rows[0][1] + "/$C$1"
  range_tmp.setValues(rows)
  
  range_tmp = sheet_rep.getRange("D9")
  rows = range_tmp.getValues()
  rows[0][0] = "=" + rows[0][0] + "/$C$1"
  range_tmp.setValues(rows)
  
  last_row = sheet_rep.getLastRow()
  range_tmp = sheet_rep.getRange(13, 2, last_row - 1 - 13 + 1, 1)
  rows = range_tmp.getValues()
  for(i in rows) {
    rows[i][0] = "=" + rows[i][0] + "/$C$1"
  }
  range_tmp.setValues(rows)

  
  
    
    
  
  //Last touches of the format

  for(var j = 1; j <= 8; j++) {
      sheet_rep.setColumnWidth(j, 150)
  }
  sheet_rep.autoResizeColumn(1)
  
  range_src = sheet_rep.getRange(13, 3, vendors_keys.length, 1)
  range_dst = sheet_rep.getRange(13, 2, vendors_keys.length, 1)
  range_src.copyTo(range_dst, {formatOnly:true})
  
  range_dst = sheet_rep.getRange(13, 4, vendors_keys.length, 1)
  range_src.copyTo(range_dst, {formatOnly:true})
  
  range_src = sheet_rep.getRange(13, 7, vendors_keys.length, 1)
  range_dst = sheet_rep.getRange(13, 5, vendors_keys.length, 1)
  range_src.copyTo(range_dst, {formatOnly:true})
  
  
  
  //Fix the total row
  last_row = sheet_rep.getLastRow()
  range_tmp = sheet_rep.getRange("G" + last_row)
  var txt = "=H" + last_row + "/C" + last_row
  range_tmp.setValue(txt)
  
}