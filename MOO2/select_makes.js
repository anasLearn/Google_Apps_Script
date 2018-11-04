function select_makes(make) {
  var result = [];

  for( var key in make) {
    if( exists_in(make[key][0], result) == false)
      result.push(make[key][0]);       
  }
 
  return result;
}
        

function exists_in(value, table) {
  if( table[0] === "ALL") //A symbolic table that contains all possible values
    return true
  for( var key in table) {
    if( table[key] == value)
      return true;
  }
  return false;
}