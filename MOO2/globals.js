//*************************************
//mm******** Global Varialbles **********
//*************************************
//UI
var ui = SpreadsheetApp.getUi();
var response;

//Time zone
var time_zone = "Australia/Brisbane"


//Important cells
var profitability_cell = "F1"
var budget_cell = "F4"
var dark_range_cell = "D5"

//Sheet
var spreadsheet = SpreadsheetApp.getActive(); // the whole file (the whole spreadsheet)
var orderSheet = spreadsheet.getSheetByName('Order Sheet'); //The order sheet
var dark_range = orderSheet.getRange(dark_range_cell) //Cell used for internal calculations
var cuSheet = spreadsheet.getSheetByName('Currency'); // The currency sheet
var data3Sheet = spreadsheet.getSheetByName('Data 3');
var vendorsPricesSheet = spreadsheet.getSheetByName('Vendors Prices');


//Start and end of products' rows
var label_row  //Later the label row can be automatically detected and the other rows deduced from it
var start
var end;
var num_products; //end - start + 1
var total_row; //the row that has the sum
var vendor_label_row // 7
var vendor_quantity_label_row //10
var master_row;

//Column markers
var markers

//Vendors names and columns
var vendors; // a dictionary of the active vendors. 
var vendors_orig; // a dictionary of all the vendors. Key : vendor number, value : vendor column
var vendors_keys; //a table with vendors numbers, in the same order as they are in the sheet
var number_active_vendors; //number of the active vendors
var first_vendor;  //the column of the first vendor - It will be used when adding a new vendor
var last_vendor;
var number_vendors;

//orders
var orders; //A dictionary of all the orders. Key : vendor number, value : vendor column
var first_order; //The column of the first order - It will be used when adding a new vendor
var last_order;
var total_orders //The column of the summary of the orders

//Limit Quantities provided by Vendors
var vendors_max_qtys //a dictionary of the columns of the maximum quantitites vendors can supply
var LQV    //a dictionary of the actual maximum quantitites
var first_qty_lim
var last_qty_lim

//important columns
var names_dict;

// budget
var budget;

//Target profitability margin
var target_margin;

//Prices
var P

//Quantities to order
var Q


//Market price
var M

//minimum Limit (Quota) to purchase per vendor
var L //  {"vendor number" : Quota, ...};


//Available Makes
var available_makes; //The available manufacturers
var makes_of_products //Am array of the makes of all products ["Sony", "Panasonic", "Sony", ...]


//To avoid running the function init() everytime
var initialized = false;

  