function add_vendor() {
  //init
  get_important_rows()
  get_important_columns()
  
  response = ui.prompt("Write the new vendor's number")
  if( response.getSelectedButton() != ui.Button.OK ) {
    ui.alert("Warning: Process cancelled by the user");
    return;
  }
  
  var new_vendor = response.getResponseText()
  if( exists_in(new_vendor, vendors_keys) ) {
    ui.alert("Vendor's number already exists");
    return;
  }
  
  
  
  //ok now add the columns
  //Insert the new vendor's column
  orderSheet.insertColumnsAfter(first_vendor, 1)
  
  //The vendor column is to be fixed after the order columns
  //insert the new vendor's columns of orders
  orderSheet.insertColumnsAfter(first_order + 4, 4)
 
  var range_tmp = orderSheet.getRange(label_row - 4, first_order + 5, 3, 4);
  
  
  //Fix the label of the new order's columns
  var rows = [["Total QTY","Total Value","MRG","Total Profit"]]
  rows.push(["", "", "", ""])
  rows.push([new_vendor,"","",""]);
              
  range_tmp.setValues(rows)
  
  range_tmp.setBackgrounds([["white", "white", "white", "white"],["white", "white", "white", "white"],["white", "white", "white", "white"]])
  
  range_tmp = orderSheet.getRange(label_row - 2, first_order + 5, 2, 4)
  range_tmp.mergeAcross()
  
  //Color the QTY cells
  range_tmp = orderSheet.getRange(label_row-4, first_order + 5, 1, 1)
  range_tmp.setBackgrounds([["magenta"]])
  range_tmp.setFontColor("white")
  
  
  
  
 
  //fix the vendor's name above the orders column
  var new_order_col = first_order + 5
  var new_vendor_col = first_vendor + 1
  var range_src = orderSheet.getRange(label_row - 1, new_order_col - 4, 3, 4)
  var range_dst = orderSheet.getRange(label_row - 1, new_order_col, 3, 4)
  range_src.copyTo(range_dst)
  
  
  
  
  //Now that the order is fixed, I can update the vendor column
  //to be reviewed
  range_src = orderSheet.getRange(vendor_label_row - 4, first_vendor, 13, 1)
  range_dst = orderSheet.getRange(vendor_label_row - 4, new_vendor_col, 13, 1)
  var formulas = range_src.getFormulasR1C1()
  range_dst.setFormulasR1C1(formulas)
  
  //Set min and max order to -1  and 200 000
  range_tmp = orderSheet.getRange(vendor_label_row + 1, new_vendor_col)
  range_tmp.setValue("-1")
  range_tmp = orderSheet.getRange(vendor_label_row + 5, new_vendor_col)
  range_tmp.setValue("200000")
  
  //vendor name
  range_tmp = orderSheet.getRange(label_row - 1, new_vendor_col)
  range_tmp.setValue(new_vendor)
  
  //vendor status
  range_tmp = orderSheet.getRange(vendor_label_row - 1, first_vendor + 1)
  range_tmp.setValue("Inactive")
  
  //Add the column of the limit supply quantity
  orderSheet.insertColumnsAfter(first_qty_lim, 1)
  range_src = orderSheet.getRange(label_row - 2, first_qty_lim, 2, 1)
  range_dst = orderSheet.getRange(label_row - 2, first_qty_lim + 1, 2, 1)
  range_src.copyTo(range_dst)
  range_tmp = orderSheet.getRange(label_row, first_qty_lim + 1)
  range_tmp.setValue(new_vendor)
  
  
  //Fix all the formulas
  get_important_rows()
  get_important_columns()
  hide_columns()
  fix_orders_formulas()
  fix_products_rows()
  fix_total_row()
}








function delete_vendor() {
  //init
  get_important_rows()
  get_important_columns()
  
  
  response = ui.prompt("Write the number of the vendor that you want to remove")
  if( response.getSelectedButton() != ui.Button.OK ) {
    ui.alert("Warning: Process cancelled by the user");
    return;
  }
  
  var obsolete_vendor = response.getResponseText()
  if( exists_in(obsolete_vendor, vendors_keys) != true ) {
    ui.alert("Vendor's number doesn't exist");
    return;
  }
  
  
  orderSheet.deleteColumns(orders[obsolete_vendor], 4)
  orderSheet.deleteColumns(vendors_orig[obsolete_vendor], 1)
  orderSheet.deleteColumns(vendors_max_qtys[obsolete_vendor], 1)
  
  
  //Fix all the formulas
  get_important_rows()
  get_important_columns()
  hide_columns()
  fix_orders_formulas()
  fix_products_rows()
  fix_total_row()
}

