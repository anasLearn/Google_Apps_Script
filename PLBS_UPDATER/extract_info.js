function extract_info(folder_in, names, marker) {
  var folder_id = folder_in
  
  
  
  var pl_folder = DriveApp.getFolderById(folder_id)
  
  var iterator = pl_folder.getFiles()
  
  var file_tmp
  var spsheet_tmp
  var sheet_tmp
  var range_tmp
  var data_tmp
  var last_row_tmp
  var data_dst, range_dst
  var i, ii, k
  var name_tmp
  
  
  
  
  //Insert the sheet of all the PL INCOMES or BS ASSETS
  var sheet_pos_name = names[0] + "_Actual_" + names[1]
  var sheet_pos = spsheet.getSheetByName(sheet_pos_name);
  if (sheet_pos) {
    sheet_pos.clear();
    sheet_pos.activate();
  } else {
    sheet_pos = spsheet.insertSheet(sheet_pos_name, spsheet.getNumSheets());
  }
  
  
  //Insert the sheet of all the PL EXPENSES or BS LIABILITES
  var sheet_neg_name = names[0] + "_Actual_" + names[2]
  var sheet_neg = spsheet.getSheetByName(sheet_neg_name);
  if (sheet_neg) {
    sheet_neg.clear();
    sheet_neg.activate();
  } else {
    sheet_neg = spsheet.insertSheet(sheet_neg_name, spsheet.getNumSheets());
  }
  
  
  
  k = -1
  while(iterator.hasNext()) {
    k++
    file_tmp = iterator.next()
    i = file_tmp.getName()
    name_tmp = i[0] + i[1] + i[2] + "-" + i[3] + i[4]
    
    spsheet_tmp = SpreadsheetApp.open(file_tmp)    
    sheet_tmp = spsheet_tmp.getSheets()
    sheet_tmp = sheet_tmp[0]    
    range_tmp = sheet_tmp.getDataRange()
    data_tmp = range_tmp.getValues()
    last_row_tmp = sheet_tmp.getLastRow()
    
    data_dst = [[name_tmp,""]]
    
    //Extract the INCOME
    for(i = 0; i < last_row_tmp; i++) {
      if(data_tmp[i][0] === marker) {
        break
      }
      data_dst.push(data_tmp[i])
    }    
    range_dst = sheet_pos.getRange(1, 2*k+1, i+1, 2)
    range_dst.setValues(data_dst) 
    
    
    //Extract the expenses
    ii = i+1
    data_dst = [[name_tmp,""]]
    for(i = ii; i < last_row_tmp; i++) {
      data_dst.push(data_tmp[i])
    }
    range_dst = sheet_neg.getRange(1, 2*k+1, last_row_tmp-ii+1, 2)
    range_dst.setValues(data_dst) 
    
  }
  
  sheet_pos.getRange("$1:$1").setNumberFormat("@")
  sheet_neg.getRange("$1:$1").setNumberFormat("@")
}
