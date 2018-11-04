//************************************************
//******** Initialization Function ***************
//************************************************

function init() {
  if( initialized )
    return;
  
  get_important_cells()
  get_important_rows()
  get_important_columns()
  hide_columns()
  prod_dup()
  fix_orders_formulas()
  fix_products_rows()
  fix_total_row()
  //sort_order_sheet()   //To be fixed
  fetch_quotas()
  fetch_makes()
  fetch_qtys_and_prices()
  
  //Set the initialized flag
  initialized = true;
  
}
  


function big_init() {
  //TBD
}


