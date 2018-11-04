//***** Gloabal variables
var ignore_vendors = false;
var ignore_priority = false;


//****Functions********
//*********************
function calculate_orders() {
  /*
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
     .alert('This will calculate the orders!');
     */
  
  
  var key, tmp, i;
  var range_tmp;
  
  init();
  


  
  

  
  // number of vendors
  var num_vendors = vendors_keys.length; 
  
  
  
  

  
  //Minimum and Maximum order quantities
  var minQ = orderSheet.getRange(start, names_dict["Min Qty"], num_products ,1).getValues(); //minimum Quantities
  var maxQ = orderSheet.getRange(start, names_dict["Max Qty"], num_products ,1).getValues(); //maximum Quantities
  

  var forecast_qty = orderSheet.getRange(start, names_dict["Forecast Qty"], num_products ,1).getValues();
  var qty_available = orderSheet.getRange(start, names_dict["Qty Available"], num_products ,1).getValues();
  for( i = 0; i < num_products; i++) {
    tmp = forecast_qty[i][0] + qty_available[i][0];  //This is the updated limit of minQ and maxQ
    if( minQ[i][0] > maxQ[i][0] )
      throw "Line " + (start + i) + ": 'Min Qty' can't be higher that 'Max Qty'";
    
    if( tmp >= minQ[i][0] )
      minQ[i][0] = 0;
    else
      minQ[i][0] -= tmp;
    
    if( tmp >= maxQ[i][0] )
      maxQ[i][0] = 0;
    else
      maxQ[i][0] -= tmp;
  }
  
  
      
  

  
  
  //********************************************
  //Find the optimal quantities
  //********************************************
  
  var priorities = orderSheet.getRange(start, names_dict["Priority"], num_products, 1).getValues(); //priority of each product [[5],[6],[1],...]
  
  
  //Monitor the usage of the budget
  var remaining_budget = budget;
  
  
  
  
  //***************************************
  //Decide the makes to consider
  var makes_to_consider = [];  
  response = ui.alert('Orders Calculation','Do you want to consider all makes?', ui.ButtonSet.YES_NO);
  
  if (response == ui.Button.YES) {
     makes_to_consider = available_makes;
  } 
  else if (response == ui.Button.NO) {
    for( key in available_makes ) {
      tmp = available_makes[key];
      
      response = ui.alert('Choose makes to take into consideration','Do you want to consider ' + tmp.toUpperCase() + '?', ui.ButtonSet.YES_NO);
      if (response == ui.Button.YES) {
        makes_to_consider.push(tmp);
      } 
      else if (response != ui.Button.NO) {
        ui.alert("Warning: Process cancelled by the user");
        return;
      }
    }
  } 
  else {
    ui.alert("Warning: Process cancelled by the user");
    return;
  }
  
  
  //******************************************
  //Decide the priorities to consider
  //The number of priorities to deal with. For (High, Medium, Low) it would be 3
  var chosen_priority;
  
  tmp = get_col_lett(names_dict["Priority"])
  range_tmp = dark_range
  range_tmp.setFormula("=MAX(" + tmp + start + ":" + tmp + end + ")");
  tmp = range_tmp.getValue();
  range_tmp.clearContent();

  chosen_priority = tmp;
  var priorities_to_consider = ["ALL"]
  
  if (ignore_priority)
    chosen_priority = 1; //So that we have only one iteration in the while loop
  else { //Give the user the choice of the priorities he wants to use
      
    
    response = ui.alert('Orders Calculation','Do you want to consider all priorities?', ui.ButtonSet.YES_NO);
    //Decide the priorities to consider
    if (response == ui.Button.YES) {
      priorities_to_consider = ["ALL"];
    } 
    else if (response == ui.Button.NO) {
      response = ui.prompt("Please write the priorities you would like to consider. Leave a space between prirorities. Example: '6 5 3'")
      if( response.getSelectedButton() != ui.Button.OK ) {
        ui.alert("Warning: Process cancelled by the user");
      return;
      }
      
      tmp = response.getResponseText()
      
      //show me some logic boy :)
      var numberPattern = /\d+/g;
      priorities_to_consider = tmp.match(numberPattern) // Returns a table that contains all the numbers in string form
      
    } 
    else {
      ui.alert("Warning: Process cancelled by the user");
      return;
    }
  }  

  
  
  
  
  

  //Profits margins of each vendors on each product
  var margins_dict = {}; //dictionary where the keys are the vendors: Sorted highest to lowest : {"key":[[i, margin], [i2, margin], ...], "key2": [[j, margin],..], "key3":... }
  var margins_array = []; //array of all the margins of all the products from all the vendors: Sorted, highest to lowest : [[i, margin, key], [i, margin, key], ... ]
  for( key in vendors ) {
    margins_dict[key] = [];
    for( i = 0; i < num_products; i++) {      
      if( exists_in(makes_of_products[i], makes_to_consider) && exists_in(priorities[i], priorities_to_consider) ) { //Only the Makes and priorities chosen by the user will be taken into account          
        if( typeof(M[i][0]) == "number" && M[i][0] > 0 ) {
          if( typeof(P[key][i][0]) == "number" && P[key][i][0] > 0 ) {
            tmp = (M[i][0] - P[key][i][0]) / P[key][i][0];
            //Fill the dictionary of the vendor
            margins_dict[key] = sorted_fill([i, tmp], margins_dict[key]);
            //Fill the whole array
            margins_array = sorted_fill([i, tmp, key], margins_array);          
          } 
        }
      }
    }
  }
  
  

  
  
  
  //How many $ ordered from each vendor 
  var order_value = {};
  for( key in vendors )
    order_value[key] = 0;
  
  
  Q = {};
  for( key in vendors ) {
    Q[key] = []
    for( i = 0; i < num_products; i++)
      Q[key].push([""]);
  }
  
  


  
  
  
  

  var max_i, price;
  
  //To be fair to all vendors, we add one product at a time to each vendor
  //The logic is this: Go to a Vendor, add 1 unit from the product where it would make the best possible profit, then go to the next vendor
  //Repeat until all the quotas are respected, or the budget runs out, or it is not possible to order anymore (limit of maxQ)
  var flag_tmp = true;
  Logger.log(ignore_vendors)
  Logger.log(ignore_priority)
  if (ignore_vendors)
    flag_tmp = false; //This will skip the part where we calculate orders to satisfy the vendors quota
  
  
  
  
  //Satisfy the vendors quotas
  while(flag_tmp) {
    flag_tmp = false;
    for( key in vendors ) {
      for( k = 0; k < margins_dict[key].length; k++) {        
        i = margins_dict[key][k][0]; //the product in question
        max_i = maxQ[i][0]; //The MAXimum quantity of the product i we can order
        price = P[key][i][0];                                                    //This presents the Limit of the quantity 
        if( (order_value[key] < L[key] && max_i > 0 && remaining_budget > price)   && (LQV[key][i][0] === "" || (typeof(LQV[key][i][0]) == "number" && LQV[key][i][0] > 0))) {
          
          flag_tmp = true;              
          
          order_value[key] += price;
          minQ[i][0] = Math.max(0, minQ[i][0] - 1);
          maxQ[i][0] -= 1;
          remaining_budget -= price;
          
          if( Q[key][i][0] == "" )
            Q[key][i][0] = 0;
          Q[key][i][0] += 1;
          
          if(typeof(LQV[key][i][0]) == "number")
             LQV[key][i][0] -= 1
          
          break;
        }
        
      }
    }
  }
  

  

  
  


  //***************************************************************************
  //*********************************************************************
//  After the vendors quotas were satisfied, it is the turn to fill the order to get the best possible margin
//  The priority is respected
//  The program starts by the product with the highest priority and highest margin and fills it until
//  Then goes to the next product of the same priority
//  Then goes to the next priority when the products of the first priority are exhausted
//  Note: The target margin is always respected
  
  
  while(chosen_priority > 0) {

    if( exists_in(chosen_priority, priorities_to_consider) != true) {
      chosen_priority --
      continue;      
    }
   
    var vnd, mrg //the vendor and the margin (in %) 
    
    for( k = 0; k < margins_array.length ; k++) {      
      if( margins_array[k][1] < target_margin )
        break;
      
      
      vnd = margins_array[k][2]
      mrg = margins_array[k][1]
      i = margins_array[k][0] //The product. It refers to its position in the array [start -> end]
      

      if( ignore_priority == true || priorities[i] == chosen_priority ) { //Consider the priorities of products only if we don't ignore the priority
        //determine the number of unit of the product in the order
        
        if( P[vnd][i][0] * maxQ[i][0] <= remaining_budget &&  (LQV[vnd][i][0] === "" || (typeof(LQV[vnd][i][0]) == "number" && LQV[key][i][0] >=  maxQ[i][0]))) {
          tmp = maxQ[i][0];
        }
        else {
          tmp= remaining_budget / P[vnd][i][0];
          tmp = Math.floor(tmp);
          if(typeof(LQV[vnd][i][0]) == "number")
            tmp = Math.min(tmp, LQV[vnd][i][0])
        }
        
        maxQ[i][0] = Math.max(0, maxQ[i][0] - tmp);
        minQ[i][0] = Math.max(0, minQ[i][0] - tmp);
        if(tmp != 0) {
          if( Q[vnd][i][0] === "") {
            Q[vnd][i][0] = 0;
          }
          
          Q[vnd][i][0] += tmp;
          
          tmp *= P[vnd][i][0];
          remaining_budget -= tmp;
          order_value[vnd] += tmp;
          
          if(typeof(LQV[vnd][i][0]) == "number")
            LQV[vnd][i][0] -= tmp
        }
      } 
        
    }
    
    chosen_priority--;
  }
  //*********************************************
  //********************************************
  
  
  
  

  
  
  
  
  
  //Fill the orders' columns
  response = ui.alert("Are you sure you want to overwrite the current orders?", ui.ButtonSet.YES_NO);
  if (response != ui.Button.YES) {
    ui.alert("Process Cancelled", "The calculated orders were not written");
    return;
  }
  
  
  currency_routine()
  
  clear_orders(false);
  Logger.log(vendors)
  Logger.log(Q)
  for( key in vendors ) {
    orderSheet.getRange(start, orders[key], num_products, 1).setValues(Q[key]);    
  }
}



function calculate_ignore_vendors() {
  ignore_vendors = true;
  calculate_orders();
}

function calculate_ignore_priority() {
  ignore_priority = true;
  calculate_orders();
}

function calculate_ignore_all() {
  ignore_priority = true;
  ignore_vendors = true;
  calculate_orders();
}

