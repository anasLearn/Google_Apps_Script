/*
function onEdit(e){
  // Set a comment on the edited cell to indicate when it was changed.
  var range = e.range;
  range.setNote('Last modified: ' + new Date());
}
*/

function test_me() {
  get_important_cells()
  get_important_rows()
  get_important_columns()
  hide_columns()
  prod_dup()
  fix_orders_formulas()
  fix_products_rows()
  fix_total_row()
  sort_order_sheet()
  fetch_quotas()
  fetch_makes()
  fetch_qtys_and_prices()
}


function testi() {
  var d = new Date()
  var tz = spreadsheet.getSpreadsheetTimeZone()
  var lc = spreadsheet.getSpreadsheetLocale()
  Logger.log(d)
  Logger.log(tz)
  Logger.log(lc)
  lc = Session.getActiveUserLocale()
  Logger.log(lc)
  tz = Session.getScriptTimeZone()
  Logger.log(tz)
}

function test_button() {
  throw "r3da"
}





