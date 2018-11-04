function fix_total_row() {
  var key
  var formula, formulas
  var j, k = 0
  var range
  var total_col
  
  formulas = [[]]
  for( key in orders) {    
    for(j = 0; j < 4; j++) {
      formula = "=SUM(" + get_col_lett(orders[key] + j) + start + ":" + get_col_lett(orders[key] + j) + end + ")"
      formulas[0].push(formula)
    }
    
    formula = "=IFERROR(" + get_col_lett(orders[key] + 3) + (end+1) + "/" + get_col_lett(orders[key] + 1) + (end+1) + ")"
    formulas[0][4*k + 2] = formula
    
    k++
  }
  
  //Take into consideration the END_ORDER column
  formulas[0].push("")
  
  
  //Add the 4 total columns
  total_col = total_orders
  for(j = 0; j < 4; j++) {
    formula = "=SUM(" + get_col_lett(total_col + j) + start + ":" + get_col_lett(total_col + j) + end + ")"
    formulas[0].push(formula)
  }
  
  formula = "=IFERROR(" + get_col_lett(total_col + 3) + (end+1) + "/" + get_col_lett(total_col + 1) + (end+1) + ")"
  formulas[0][1+ 4*k + 2] = formula
  
  range = orderSheet.getRange(end + 1, first_order, 1, (vendors_keys.length + 1) * 4 + 1)
  
  range.setValues(formulas)  
  
}





function fix_products_rows() {
  //start = label_row + 2
  //end = orderSheet.getLastRow() - 1
  
  var j, k
  var last_column = orderSheet.getLastColumn()
  var range_src = orderSheet.getRange(start - 1, 1, 1, last_column)
  var range_dst
  var formulas_src
  var formulas_dst = []
  var data_valid_src
  var data_valid_dst = []
  
  
  formulas_src = range_src.getFormulasR1C1()
  data_valid_src = range_src.getDataValidations()
  data_valid_dst = []
  
  for(k = 1; k <= last_column; k++) {
    if( formulas_src[0][k-1] !== "") {
      formulas_dst = []
      for( j = start; j <= end; j++) {
        formulas_dst.push([formulas_src[0][k-1]])
      }
      range_dst = orderSheet.getRange(start, k, end - start + 1, 1)
      range_dst.setFormulasR1C1(formulas_dst)
    }
  }
  
  for( j = start; j <= end; j++) {
    data_valid_dst.push(data_valid_src[0])
  }
  
  range_dst = orderSheet.getRange(start, 1, end - start + 1, last_column)
  range_dst.setDataValidations(data_valid_dst)
}


//This function fixes the orders formulas after the adding or deleting of a vendor
function fix_orders_formulas() {
  var formulas , formula
  var key, j
  
  formulas = []
  for (key in orders) {
    formulas.push("")
    formulas.push("=" + get_col_lett(vendors_orig[key]) + master_row + "*" + get_col_lett(orders[key]) + master_row )
    
    formula = ""
    formula += "=IFERROR(($" + get_col_lett(names_dict["Market Price"]) + master_row + " - " + get_col_lett(vendors_orig[key]) + master_row + ")"
    formula += "*" + "$" + get_col_lett(names_dict["Market Price"]) + master_row
    formula += "/($" + get_col_lett(names_dict["Market Price"]) + master_row + "*" + get_col_lett(vendors_orig[key]) + master_row + "))"
    formulas.push(formula)
    
    formulas.push("=" + get_col_lett(orders[key] + 1) + master_row + "*" + get_col_lett(orders[key] + 2) + master_row )
  }
  
  formulas = [formulas]
  
  orderSheet.getRange(master_row, first_order, 1, 4 * number_vendors).setFormulas(formulas)
  
  
  //Fix the totals
  formulas = []
  
  formula = "=SUM("
  for(key in orders) {
    formula += get_col_lett(orders[key]) + master_row + ","
  }
  formula += ")"
  formulas.push(formula)
  
  
  formula = "=SUM("
  for(key in orders) {
    formula += get_col_lett(orders[key]+1) + master_row + ","
  }
  formula += ")"
  formulas.push(formula)
  
  formula = "=" + get_col_lett(names_dict["Margin %"]) + master_row
  formulas.push(formula)
  
  formula = "=" + get_col_lett(markers["#TOTALS"] + 1) + master_row + "*" + get_col_lett(markers["#TOTALS"] + 2) + master_row
  formulas.push(formula)
  
  formulas = [formulas]
  orderSheet.getRange(master_row, markers["#TOTALS"], 1, 4).setFormulas(formulas)
  
  
  //Fix Est Av Pur Price
  formulas = []
  formula = "=IFERROR(" + get_col_lett(markers["#TOTALS"] + 1) + master_row + "/" + get_col_lett(markers["#TOTALS"]) + master_row + ")"
  formulas.push(formula)
  formulas = [formulas]
  orderSheet.getRange(master_row, names_dict["Est Av Pur Price"], 1, 1).setFormulas(formulas)
  
  
  
  //Fix the formulas of the actual order in the Vendor Prices columns
  formulas = []
  for(key in vendors_orig) {
    formulas.push( "=" + get_col_lett(orders[key] + 1) + total_row)
  }
  formulas = [formulas]
  orderSheet.getRange(vendor_label_row + 4, first_vendor, 1, number_vendors).setFormulas(formulas)
  
  //Fix the total formulas at the top of the order columns
  formulas = []
  for(key in orders) {
    for(j=0; j<4; j++) {
      formulas.push( "=" + get_col_lett(orders[key] + j) + total_row)
    }
  }
  formulas = [formulas]
  orderSheet.getRange(label_row - 3, first_order, 1, 4 * number_vendors).setFormulas(formulas)
}
       
       
       
       
       
       
       
       
       
       
       
