function onOpen() {
  var ui = SpreadsheetApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Extract Data')
      .addItem('Extract PL Data', 'gather_INCOMES_EXPENSES_for_PL')
      .addItem('Extract BS Data', 'gather_ASSETS_LIABILITIES_for_BS')
      .addItem('Generate Fields', 'generate_all_fields')
      .addToUi();
}
