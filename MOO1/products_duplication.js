function prod_dup() {
  //****************************************************
  //Warn the user if there are empty fields
  var last_row = orderSheet.getLastRow()
  var pm_col_data = orderSheet.getRange(1, names_dict["PN"], last_row, 1).getValues()
  
  var emptys = detect_empty(pm_col_data, start, end)
  
  if(emptys.length > 0) {
    txt = "ERROR\n\n"
    if(emptys.length > 0) {
      txt += "There are empty product cells in the PN column, in the rows:\n\n"
      for(i = 0; i < emptys.length; i ++) {
        txt += emptys[i] + ", "
      }
      txt += "\n\n"
    }
    
    ui.alert(txt)
    throw "Please check the product rows with no PN"
  }
  //******************************************************
  
  
  //******************************************************
  //Warn the user if there are any duplication
  var dupls = detect_duplicates(pm_col_data, start, end)
  
  txt = ""  
  if( dupls.length > 0) {
    txt += "ERROR\n\nThe following products are duplicated:\n\n"
    
    for(i = 0; i < dupls.length; i++) {
      txt += "The rows "
      for(j = 0; j < dupls[i].length; j++) {
        txt += dupls[i][j] + ", "
      }
      txt += "are duplicated.\n"      
    }
    
    ui.alert(txt)
    throw "Please check the duplicated products"
  }
  //******************************************************
  
}
