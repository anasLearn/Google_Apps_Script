function fill_rows(elm, R) {
  // R = [[e1], [e2], [e3], ...]
  //if elm doesn't exit in R we add it. elm = [e]
  
  var i
  
  for(i = 0; i <R.length; i++) {
    if (elm[0] === R[i][0]) {
      return
    }    
  }
  
  R.push(elm)  
}
