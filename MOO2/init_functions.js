function get_important_cells() {
  //Budget
  budget = orderSheet.getRange(budget_cell).getValue();
  
  //Target profit
  target_margin = orderSheet.getRange(profitability_cell).getValue();
}

function get_important_rows() {
  label_row = 15; //Later the label row can be automatically detected and the other rows deduced from it
  vendor_label_row = label_row - 8;
  total_row = orderSheet.getLastRow();
  start = label_row + 2
  end = total_row - 1;
  num_products = end - start + 1;
  master_row = label_row + 1;
}

function get_markers_columns() {
  var markers_row = orderSheet.getRange("1:1").getValues()
  var markers_keys = ["#VND_QTY", "#END_VND_QTY", "#VND_PRC", "#END_VND_PRC", "#ORDERS", "#END_ORDERS", "#TOTALS"]
  var j, k
  var qty_size, prc_size, ord_size

  markers = {}
  for(k=0; k<markers_keys.length; k++) {
    for(j=0; j<markers_row[0].length; j++) {
      if(markers_keys[k] === markers_row[0][j]) {
        markers[markers_keys[k]] = j+1
        break;
      }
    }
    if(j === markers_row.length) {
      throw "The marker " + markers_keys[k] + " Does not exist"
    }
  }

  qty_size = markers["#END_VND_QTY"] - markers["#VND_QTY"] - 1
  prc_size = markers["#END_VND_PRC"] - markers["#VND_PRC"] - 1
  ord_size = (markers["#END_ORDERS"] - markers["#ORDERS"] - 1)/4

  if( (qty_size !== prc_size) || (qty_size !== ord_size) ) {
    throw "There is not the same number of vendors in the categories : 'Limit Supply Quantity', 'Unit Price' and 'Orders'"
  }
}


function get_important_columns() {
  get_markers_columns()

  var vals_tmp
  var i, j, k

  //Get the columns of the vendors prices
  first_vendor = markers["#VND_PRC"] + 1
  last_vendor  = markers["#END_VND_PRC"] - 1
  number_vendors = last_vendor - first_vendor + 1

  var status_vendors = orderSheet.getRange(vendor_label_row-1, first_vendor, 1, number_vendors).getValues()
  vals_tmp = orderSheet.getRange(label_row-1, first_vendor, 1, number_vendors).getValues()
  
  status_vendors = status_vendors[0]
  vals_tmp = vals_tmp[0]
  
  vendors = {} //active vendors
  vendors_orig = {}
  vendors_keys = []
  number_active_vendors = 0
  
  for(j = 0; j < vals_tmp.length; j++) {
    if(vals_tmp[j] in vendors_keys) {
      throw "Duplication in Vendors numbers: " + vals_tmp[j]
    }

    if(status_vendors[j] === "Active") {
      vendors[vals_tmp[j]] = first_vendor + j
      number_active_vendors += 1
    }

    vendors_orig[vals_tmp[j]] = first_vendor + j
    vendors_keys.push(vals_tmp[j])
  }

  
  //Get the  columns of the orders
  first_order = markers["#ORDERS"] + 1
  last_order = markers["#END_ORDERS"] - 4
  total_orders = markers["#TOTALS"]
  orders = {}
  
  vals_tmp = orderSheet.getRange(label_row - 2, first_order, 1, last_order-first_order+1).getValues()
  vals_tmp = vals_tmp[0]
  
  for(j = 0; j < vals_tmp.length; j++) {
    if(j%4 !== 0) {
      continue
    }
    
    if(vals_tmp[j] in orders) {
      throw "Duplication in the Orders " + vals_tmp[j] + ", in the column " + get_col_lett(first_order + j)
    }
    
    if (!(vals_tmp[j] in vendors_orig)) {
      throw "This number " + vals_tmp[j] + " does not exist in the vendor prices" 
    }
    
    orders[vals_tmp[j]] = first_order + j
  }
 
  
  //Get the columns of the limit supply quantities
  vendors_max_qtys = {};
  first_qty_lim = markers["#VND_QTY"] + 1
  last_qty_lim = markers["#END_VND_QTY"] - 1
  
  vals_tmp = orderSheet.getRange(label_row, first_qty_lim, 1, last_qty_lim - first_qty_lim + 1).getValues()
  vals_tmp = vals_tmp[0]
  
  for(j = 0; j < vals_tmp.length; j++) {
    
    if(vals_tmp[j] in vendors_max_qtys) {
      throw "Duplication in the supply quantity limit of " + vals_tmp[j] + ", in the column " + get_col_lett(first_order + j)
    }
    
    if (!(vals_tmp[j] in vendors_orig)) {
      throw "This vendor number " + vals_tmp[j] + " does not exist in the vendor prices" 
    }
    
    vendors_max_qtys[vals_tmp[j]] = first_qty_lim + j
  }

  //Important column names
  var names = ["PN", "Model", "Part", "Make", "Category", "Existing Priority", "Priority", "Qty on Hand", "Forecast Qty", "Qty Available", "Min Qty", "Max Qty", "Target Qty", "Market Price", "Margin %", "Est Av Pur Price", "Base Cost"];
  names_dict = {}; //A dictionary that has the columns of the above names


  //Setting columns numbers
  vals_tmp = orderSheet.getRange(label_row, 1, 1, first_vendor).getValues()
  for( k = 0; k < names.length; k++) {
    for( j = 1; j < first_vendor; j++) {
      if( names[k] === vals_tmp[0][j-1] ) {
        names_dict[names[k]] = j;
        break;        
      }    
    }
    if( j == first_vendor ) {
      throw "The label: " + names[k] + " doesn't exist. Hint: check for a spelling mistake";
    }       
  }
}


//Hide Useless columns
function hide_columns() {
  var key
  for(key in orders) {
    if (!(key in vendors)) {
      orderSheet.hideColumns(orders[key], 4)
    }    
  }
  
  orderSheet.hideColumns(markers["#VND_QTY"], number_vendors + 2)
  orderSheet.hideColumns(markers["#VND_PRC"])
  orderSheet.hideColumns(markers["#END_VND_PRC"])
  orderSheet.hideColumns(markers["#ORDERS"])
  orderSheet.hideColumns(markers["#END_ORDERS"])
  
  //Hide the master rows
  orderSheet.hideRows(label_row + 1)
}

function sort_order_sheet() {
  //sort by priority
  var last_column = orderSheet.getLastColumn()
  var range_to_sort = orderSheet.getRange(start, 1, num_products, last_column) 
  range_to_sort.sort({column: names_dict["Priority"], ascending: false});
}

function fetch_quotas() {
  //Retrieving the quotas
  L = {}
  var tmp
  var vals_tmp = orderSheet.getRange(vendor_label_row + 2, first_vendor, 1, number_vendors).getValues()
  var sum_vendors_quotas = 0.0;
  for( key in vendors ) {
    tmp = vals_tmp[0][vendors[key] - first_vendor]
    L[key] = tmp
    sum_vendors_quotas += tmp;
    
    if( typeof(tmp) != "number" ) {
      throw "Please check the Format of the minimum quotas of the vendor: " + key; 
    }
  }
  
  if(sum_vendors_quotas > budget) {
    ui.alert("Warning: The budget is lower than the sum of the minimum vendors' quotas");
  }
}

function fetch_makes() {
  makes_of_products = orderSheet.getRange(start, names_dict["Make"], num_products, 1).getValues(); //The make of each product [[Samsung],[Apple],[Huawei],....]
  available_makes = select_makes(makes_of_products);
}

function fetch_qtys_and_prices() {
  var key
  //Prices
  P = {};
  for(key in vendors_orig) {    
    P[key] = orderSheet.getRange(start, vendors_orig[key], num_products, 1).getValues(); 
  }
  
  //Quantities to order
  Q = {};
  for( key in vendors_orig ) {
    Q[key] = orderSheet.getRange(start, orders[key], num_products, 1).getValues();
  }
  
  //Market price
  M = orderSheet.getRange(start, names_dict["Market Price"], num_products ,1).getValues();
  
  //Get the LQV
  var start_qty = first_qty_lim
  var end_qty = last_qty_lim
  
  
  LQV = {}
  var lab_tmp = orderSheet.getRange(label_row, start_qty, 1, end_qty - start_qty + 1).getValues()  
  for (key in vendors_orig) {
    LQV[key] = orderSheet.getRange(start, vendors_max_qtys[key], end - start + 1, 1).getValues()
  }
  
}


