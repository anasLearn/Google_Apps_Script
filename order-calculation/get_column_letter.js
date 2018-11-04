function get_col_lett(num_in) {
  var num = num_in
  var answer_arr = []
  var answer_txt = ""
  while(num != 0) {
    if(num % 26 == 0)
      answer_arr.push(26)
    else  
      answer_arr.push(num % 26)
    num = Math.floor((num-1) / 26)
  }
  
  for( var i = answer_arr.length -1; i >= 0; i--)
    answer_txt += String.fromCharCode(64 + answer_arr[i])
    
  return answer_txt
  
  
  //A second method
  /*
  dark_range = SpreadsheetApp.getActive().getSheetByName('Order Sheet').getRange(1, 3)
  dark_range.setFormula("=REGEXEXTRACT(ADDRESS(1; " + num_in + "); \"[A-Z]+\")");
  */ 
}


function get_col_num(lett_in) {
  var res = 0
  for (var i = 0, len = lett_in.length; i < len; i++) {
    res *= 26
    res += lett_in.charCodeAt(i) - 64;
  }
  return res
}





