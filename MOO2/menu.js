function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Order Calculator')
      .addItem('Initialize and Sort', 'init')
      .addSubMenu(ui.createMenu('Calculate Orders')
          .addItem('Normally', 'calculate_orders')
          .addItem('Ignore Priority', 'calculate_ignore_priority')
          .addItem('Ignore Vendors Quotas', 'calculate_ignore_vendors')
          .addItem('Ignore All', 'calculate_ignore_all'))          
      .addSeparator()
      .addSubMenu(ui.createMenu('Tools')
          .addItem('Clear Orders', 'menu_clear_orders')
          .addItem('Generate Orders\' sheets and reports', 'generate_orders_sheets')
          .addItem('Generate Reports Only', 'gen_reps_from_menu')
          .addItem('Remove all the reports and generated orders', 'rm_reports'))  
      .addSeparator()
      .addSubMenu(ui.createMenu('Vendors tools')
          .addItem('Add vendor', 'add_vendor')
          .addItem('delete vendor', 'delete_vendor'))
      .addSubMenu(ui.createMenu('Currency convertor')
          .addItem('Update rates', 'update_rates'))  
      .addToUi();
}

