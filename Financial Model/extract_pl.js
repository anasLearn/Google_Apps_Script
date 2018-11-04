function gather_INCOMES_EXPENSES_for_PL() {
  var folder_in = PL_FOLDER
  var names = ["PL", "INCOMES", "EXPENSES"]
  var marker = "Expenses"
  
  extract_info(folder_in, names, marker)
}
