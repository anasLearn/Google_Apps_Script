function generate_fileds_column(sheet_name, section_start, section_end) {
  
  
  var sheet_pos
  
  var extractedSheet = spsheet.getSheetByName(sheet_name)
  var last_col, last_row
  
  var R = [] //The rows that we extract
  var formatted_R = []
  var data_col
  
  var i, j, k
  var ib, ie //ib: i_begin, ie: i_end
  
  if(extractedSheet == false) {
    ui.alert("Operation canceled: Please extract the data first");
    return
  }
  
  last_col = extractedSheet.getLastColumn()
  last_row = extractedSheet.getLastRow()
  
  
  //*******************************
  for(k = 0; k < section_start.length; k++) {
  
    R.push([])
    
    
    
    for( j = 1; j <= last_col; j++)  {
      if( j % 2 === 0) {
        continue
      }
      data_col = extractedSheet.getRange(1, j, last_row, 1).getValues()
      
      ib = 0
      ie = 0
      for(i = 0; i < last_row; i++) {
        if(data_col[i][0] === section_start[k]) {
          ib = i;
          continue
        }
        
        if(data_col[i][0] === section_end[k]) {
          ie = i;
          break
        }
      }
      
      for(i = ib + 1; i <= ie - 1; i++) {
        fill_rows(data_col[i], R[k])
      }
      
    }
    R[k].sort()
    R[k].unshift([section_start[k]])
    R[k].push([section_end[k]])


    for(i=0; i < R[k].length; i++) {
      formatted_R.push(R[k][i])
    }    
    formatted_R.push([""], [""], [""])
  }
  //*********************************

  return formatted_R
  
  
}
