function clear_orders(print) {  
  if( print ) {
    response = ui.alert("Are you sure you want to clear all the orders?", ui.ButtonSet.YES_NO);
    if (response != ui.Button.YES) {
      ui.alert("Process Cancelled", "The order aren't cleared");
      return;
    }
  }
  
  if( initialized == false)  //This is necessary, otherwise, it will read the old quantities when filling the quantities in the orders
    init();
  
  for (key in orders) {
    orderSheet.getRange(start, orders[key], num_products, 1).clear({contentsOnly: true});    
  }   
}


function menu_clear_orders() {  
  clear_orders(true)
}