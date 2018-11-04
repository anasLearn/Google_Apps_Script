function generate_orders_sheets() {
  
  init();
  
  var part = orderSheet.getRange(start, names_dict["Part"], num_products, 1).getValues();
  var PN = orderSheet.getRange(start, names_dict["PN"], num_products, 1).getValues();
  var make = orderSheet.getRange(start, names_dict["Make"], num_products, 1).getValues();
  var price; //the unit price of the vendor in question
  var Qy; //The quantities
  var data;
  var sheet_tmp;
  var sheet_name_tmp;
  var d = new Date();
  var d1;
  var d2;
  var rows;
  var range_tmp;
  
  
  d1 = Utilities.formatDate(d, time_zone, "yyyy-MM-dd");
  d2 = Utilities.formatDate(d, time_zone, "HH:mm:ss");
  
  
  
  
  //Generate the reports
  generate_reports(d1, d2)
  
  
  for (key in vendors) {
    
    //Get the data rows
    price = [];
    Qy = [];
    data = [];
    price = P[key];
    Qy = Q[key];    
    for( var i = 0; i < num_products; i++) {
      if( Qy[i][0] != "" ) {
        data.push([ part[i][0], PN[i][0], make[i][0], Qy[i][0], "", "", "", "" ]  )
      }        
    }   
    if (data.length === 0)
      continue;
    
    //The generated orders, sheet name
    sheet_name_tmp = "Orders of " + orderSheet.getRange(label_row, vendors[key]).getValue() + ' on ' + d1 + ' at ' + d2;
    
    
    //Insert the sheet
    var sheet_tmp = spreadsheet.getSheetByName(sheet_name_tmp);
    if (sheet_tmp) {
      sheet_tmp.clear();
      sheet_tmp.activate();
    } else {
      sheet_tmp = spreadsheet.insertSheet(sheet_name_tmp, spreadsheet.getNumSheets());
    }
       
    
    //Fill the sheet up
    //Fill the headers
    rows = [["Date of Order: ", d1], ["Time of Order: ", d2], ["Vendor's Number: ", key], ["Vendor's Name:", ""] ]
    sheet_tmp.getRange(1, 1, 4, 2).setValues(rows)
    sheet_tmp.getRange("B4").setFormula("=HLOOKUP($B$3,'Vendors Prices'!$A$9:$Z$10,2,0)")
    
    
    rows = [ ["Part", "PN", "Make", "Quantity", "Unit Price", "Order Value", "Unit Price", "Order Value"] ]
    sheet_tmp.getRange(6, 1, 1, 8).setValues(rows)
    sheet_tmp.getRange("E3").setValue("=MATCH($B$3,'Vendors Prices'!$B$9:$Z$9, 0)")
    
    
    
    //Fix the currency
    rows = [["Original Currency", "", "Chosen Currency", ""]]
    rows.push([])
    rows[1].push("=HLOOKUP($B$3,'Vendors Prices'!$C$9:$Z$11,3,0)")
    rows[1].push("=VLOOKUP($E$5, Currency!$A$1:$C$50,3,0)")
    rows[1].push(orderSheet.getRange("B1").getValue())
    rows[1].push("=VLOOKUP($G$5, Currency!$A$1:$C$50,3,0)")    
    sheet_tmp.getRange("E4:H5").setValues(rows)
    
    var cuSheet = spreadsheet.getSheetByName('Currency');
    var range_src = cuSheet.getRange("A2:A50")
    var cell_dst = sheet_tmp.getRange("G5")
    var rule = SpreadsheetApp.newDataValidation().requireValueInRange(range_src).build();
    cell_dst.setDataValidation(rule)
    
    //Fix thenFill the data
    var orig_curr = sheet_tmp.getRange("F5").getValue()
    var chos_curr = sheet_tmp.getRange("H5").getValue()
    for(i = 0; i < data.length; i++) {
      data[i][4] = "=VLOOKUP($B" + (7 + i) + ", 'Vendors Prices'!$B$1:$Z$1000, $E$3, 0)"
      data[i][5] = "=$D" + (7 + i) + "*$E" + (7 + i)
      data[i][6] = "=$E" + (7 + i) + "* $F$5 / $H$5"
      data[i][7] = "=$D" + (7 + i) + "*$G" + (7 + i)
    }
    sheet_tmp.getRange(7, 1, data.length, 8).setValues(data)
    
    //Fill the total row
    sheet_tmp.getRange(7 + data.length, 3, 1, 6).setValues([["Total", "=sum(D7:D" + (6 + data.length) + ")", "", "=sum(F7:F" + (6 + data.length) + ")", "", "=sum(H7:H" + (6 + data.length) + ")"]])
    
    
    //Layout of the sheet
    sheet_tmp.getRange('A1:H6').setFontWeight('bold');
    sheet_tmp.getRange('C' + (7 + data.length) + ':H' + (7 + data.length)).setFontWeight('bold');
    var num_col = 8
    for( var i = 1; i <= num_col; i++) {
      sheet_tmp.setColumnWidth(i, 200)
    }
    
    var num_rows = 6 + data.length + 1
    for( var i = 1; i <= num_rows; i++)
      sheet_tmp.setRowHeight(i, 20)  
    
    
    range_tmp = sheet_tmp.getRange("E:H")
    range_tmp.setNumberFormat('0.00')
    
    range_tmp = sheet_tmp.getRange(6, 1, 1 + data.length, 8)
    range_tmp.setBorder(true, true, true, true, true, true)
    
    sheet_tmp.getRange("E4:F4").merge()
    sheet_tmp.getRange("G4:H4").merge()
    sheet_tmp.getRange("E4:H5").setBorder(true, true, true, true, true, true)
    
    var bg = orderSheet.getRange("B1").getBackground()
    sheet_tmp.getRange(4, 7, 3 + data.length + 1, 2).setBackground(bg)
    
    sheet_tmp.getRange("F5").setNumberFormat('0.00000')
    sheet_tmp.getRange("H5").setNumberFormat('0.00000')
    
    range_tmp = sheet_tmp.getDataRange()
    range_tmp.setFontSize(11)
    range_tmp.setVerticalAlignment("middle")
    range_tmp.setHorizontalAlignment("center")
    
    sheet_tmp.getRange("E3").setBackground("black")
    
    range_tmp = sheet_tmp.getRange("E7:E" + (sheet_tmp.getLastRow() - 1))
    
    range_tmp.copyValuesToRange(sheet_tmp, 5, 5, 7, sheet_tmp.getLastRow() - 1)
    
    sheet_tmp.getRange("E3").clear()
    
  }
}
