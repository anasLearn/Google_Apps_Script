function sorted_fill(input_value, twoD_table) {
  var result_array = [];
  for(var i = 0; i < twoD_table.length; i++) {
    if( bigger(input_value, twoD_table[i]) ) {
      for( var j = 0; j < i; j++)
         result_array.push(twoD_table[j]);
      result_array.push(input_value);
      for( var j = i; j < twoD_table.length; j++)
         result_array.push(twoD_table[j]);
      break;
    }     
  }
  if( i == twoD_table.length) {
    result_array = twoD_table;
    result_array.push(input_value);
  }
  
  return result_array;
}

function bigger(A, B) {
  if (A[1] > B[1])
    return true;
  return false;
}
         
         
