function detect_duplicates(tabr, start, end) {
  //tabr is a tab of rows [[d1],[d2], ....]
  
  var i, j
  var dup_i  = [] //A table containis the rows that are duplicated with i [..., i, ...]
  var dupr = [] //all the rows that are duplicated in a table [3, 7, 20, ....]
  var result = []//A table containing tables of duplicated groups [[1, 4, 7], [2, 33], ....]
  
  for(i = start; i <= end; i++) {
    dup_i = [i]
    if(exists_in(i, dupr)) {
       continue
    }
       
    for(j = i + 1; j <= end; j++) {
      if(exists_in(j, dupr)) {
       continue
      }
      if( tabr[i-1][0] !== tabr[j-1][0] ) {
       continue
      }
      
      //There is a duplication of the rows i and j
      dupr.push(j)
      dup_i.push(j)
        
    
    }
    
    if( dup_i.length > 1) {
      result.push(dup_i)
    }
  }
  
  return result
}
