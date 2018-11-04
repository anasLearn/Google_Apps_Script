function exists_in(value, table) {
  if( table[0] === "ALL") //A symbolic table that contains all possible values
    return true
  for( var key in table) {
    if( table[key] == value)
      return true;
  }
  return false;
}



function exists_in_2d(value_2d, table_2d) {
  if( table_2d[0][0] === "ALL") //A symbolic table that contains all possible values
    return true
  for( var key in table_2d) {
    if( table_2d[key][0] == value_2d[0])
      return true;
  }
  return false;
}

