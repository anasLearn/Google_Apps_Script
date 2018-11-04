//Checks if 2 ranges are the same
function equal_ranges(A, B) {
  if( A.getSheet().getSheetId() !== B.getSheet().getSheetId()) {
    return false;
  }
  
  if( A.getA1Notation() !== B.getA1Notation()) {
    return false;
  }
  
  return true;
}


//To check if the range is in the generated orders's sheet
function similar_range(A, sheet_name, range_notation) {
  var i = 0;
  var test_txt = A.getSheet().getName()
  for(i = 0; i < sheet_name.length; i++) {
    if( test_txt[i] !== sheet_name[i] ) {
      return false;
    }
  }
  
  if( A.getA1Notation() !== range_notation) {
    return false;
  }
  
  
  return true;
}



//Checks the sheet of the ranges are equals
function equal_range_sheets(A, B) {
  if( A.getSheet().getSheetId() !== B.getSheet().getSheetId()) {
    return false;
  }
  
  
  return true;
}



