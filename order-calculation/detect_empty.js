function detect_empty(tabr, start, end) {
  //tabr is a tab of rows [[d1],[d2], ....]
  
  var i
  var result = [] // A table containing the rows of the empty fields
  
  for(i = start; i <= end; i++) {
    if( tabr[i-1][0] === "" )
      result.push(i)
  }
  return result
}
