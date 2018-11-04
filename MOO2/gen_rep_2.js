
//Makewise summary
function generate_report_2(d1, d2) {
  initialized = false  
  init()
  
  var range_tmp
  var range_src, range_dst
  
  

  
  //Insert the sheet
  var sheet_name_rep2 = "Makewise Report " + d1 + " " + d2
  var sheet_rep = spreadsheet.getSheetByName(sheet_name_rep2);
  if (sheet_rep) {
    sheet_rep.clear();
    sheet_rep.activate();
  } else {
    sheet_rep = spreadsheet.insertSheet(sheet_name_rep2, spreadsheet.getNumSheets());
  }
  
  
  //Fill the general info
  var rows
  rows = [ ["Makewise summary", ""], ["Date of Order: ", d1], ["Time of Order: ", d2]]
  sheet_rep.getRange(2,1,3,2).setValues(rows)
  sheet_rep.getRange('A2:B4').setFontWeight('bold');
  
  range_src = orderSheet.getRange("A1:C1")
  range_dst = sheet_rep.getRange("A1:C1")
  range_src.copyTo(range_dst)

  //Set the headers rows
  rows = [["Vendor"],[""]]
  for(var key in available_makes) {
    rows[0].push(available_makes[key], "", "", "")
    rows[1].push("QTY", "Value", "MRG", "Profit")
  }
  
  rows[0].push("Order Summary By Vendor", "", "", "")
  rows[1].push("Total Order QTY", "Total Order Value", "Total Order Margin", "Total Order Profit")
  
  range_tmp = sheet_rep.getRange(6, 1, 2, 1 + 4 * (available_makes.length + 1))
  range_tmp.setValues(rows)
  
  var max_cols = sheet_rep.getLastColumn()
  
  //Format the headers rows
  range_tmp.setFontWeight('bold');
  sheet_rep.getRange(6, 1, 2, 1).merge()
  var R, G, B
  for(var key in available_makes) {
    range_tmp = sheet_rep.getRange(6, 2 + 4 * key, 1, 4)
    range_tmp.merge()
    var colors = [Math.random() * 51 + 204, Math.random() * 51 + 204, Math.random() * 51 + 204]
    var i = Math.floor((Math.random() * 3))
    colors[i] = Math.random() * 255
    R = colors[0]
    G = colors[1]
    B = colors[2]
    range_tmp.setBackgroundRGB(R, G, B)
    
    range_tmp = sheet_rep.getRange(7, 2 + 4 * key, 1, 1)
    range_tmp.setBackgrounds([["magenta"]])
    range_tmp.setFontColor("white")
  }
  range_tmp = sheet_rep.getRange(6, 2 + 4 * available_makes.length, 1, 4)
  range_tmp.merge()
  range_tmp = sheet_rep.getRange(6, 2 + 4 * available_makes.length, 2, 4)
  range_tmp.setBackgroundRGB(204, 255, 204)
  
  
  //Fill the data
  rows = []
  var j = -1
  var vendor_name
  Make = makes_of_products
  for(key in vendors) {
    j++;
    vendor_name = orderSheet.getRange(label_row, vendors[key]).getValue()
    var tot_qty=0, tot_pri=0, tot_m_pri=0 //quantity, price and market price of ALL the products bought from the vendor key
    rows.push([key + " : " + vendor_name])
    for(var m in available_makes) {
      var qty=0, pri=0, m_pri=0 //quantity, price and market price of the products of make m bought from the vendor key
      for(i = 0; i < num_products; i++) {
        if( Make[i][0] !== available_makes[m]) {
          continue;
        }
        qty += 0 + Q[key][i][0] * 1
        pri += 0 + Q[key][i][0] * P[key][i][0]
        m_pri += 0 + Q[key][i][0] * M[i][0]
      }
      
      
      tot_qty += qty
      tot_pri += pri
      tot_m_pri += m_pri
      if(pri == 0) {
        rows[j].push(qty, pri, "NA", (m_pri - pri) ) 
      }
      else {
          rows[j].push(qty, pri, (m_pri - pri) / pri, (m_pri - pri) ) 
      }
            
    }
    if(tot_pri == 0) {
      rows[j].push(tot_qty, tot_pri, "NA", (tot_m_pri - tot_pri) ) 
    }
    else {
      rows[j].push(tot_qty, tot_pri, (tot_m_pri - tot_pri) / tot_pri, (tot_m_pri - tot_pri) ) 
    }
        
  }
  
  sheet_rep.getRange(8, 1, number_active_vendors, 1 + available_makes.length * 4 + 4).setValues(rows)
   
  
  
  //Implement the currency converter
  var last_row = sheet_rep.getLastRow()
  for(j = 2; j < max_cols; j = j+2) {
    range_tmp = sheet_rep.getRange(8, j + 1, last_row - 8 + 1, 1)
    rows = range_tmp.getValues()
    for(i in rows) {
      rows[i][0] = "=" + rows[i][0] + "/$C$1"
    }
    range_tmp.setValues(rows)
  }
  
  
  
  //Last touches of the format
  for(j = 1; j <= max_cols; j++) {
      sheet_rep.setColumnWidth(j, 120)
  }
  range_tmp = sheet_rep.getRange(6, 1, sheet_rep.getLastRow() - 5, max_cols)
  range_tmp.setVerticalAlignment("middle")
  range_tmp.setHorizontalAlignment("center")
  range_tmp.setBorder(true, true, true, true, true, true)
  
  range_src = orderSheet.getRange(start, first_order, number_active_vendors, 4 )//* (available_makes.length + 1) )
  range_dst = sheet_rep.getRange(8, 2, number_active_vendors, 4 * (available_makes.length + 1) )
  
  range_src.copyTo(range_dst, {formatOnly:true})
  
  
  
  //Fix the total row
  last_row = sheet_rep.getLastRow()
  var row= ["Total"]
  var txt
  for(j=1; j < max_cols; j++) {
    if(j%4 === 3) {
      txt = "=IFERROR(" + get_col_lett(j+2) + (last_row + 1) + "/" + get_col_lett(j) + (last_row + 1) + ',"NA")'
    }
    else {
      txt = "=SUM(" + get_col_lett(j+1) + "8" + ":" + get_col_lett(j+1) + last_row + ")"
    }
    
    row.push(txt)
  }
  
  rows = [row]
  
  range_tmp = sheet_rep.getRange(last_row + 1, 1, 1, max_cols)
  range_tmp.setValues(rows)
  
  //fix the format of the total row
  range_dst = range_tmp
  range_src = sheet_rep.getRange(8, 1, 1, max_cols)
  range_src.copyTo(range_dst, {formatOnly:true})
  range_tmp.setFontWeight("bold")
  range_tmp.setBackground("yellow")
}

