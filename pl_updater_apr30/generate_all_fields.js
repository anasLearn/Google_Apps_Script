function generate_all_fields() {
	//This function will generate all accounts for the PL
	//And it will also generate all the Assests and Liabilities for the BS
	//And it put them all in one file

	var sheet_name
  	var generated_sheet_name = "GENERATED DATA"
  	var section_start
  	var section_end

  	var gen_cols = []
  	var i


  	//PL Incomes
  	var incomes_fields
  	sheet_name = "PL_Actual_INCOMES"
  	section_start = ["Operating Income", "Cost of Revenue", "Other Income"]
  	section_end   = ["Total Operating Income", "Total Cost of Revenue", "Total Other Income"]

	incomes_fields = generate_fileds_column(sheet_name, section_start, section_end)
	gen_cols.push(incomes_fields)



	//PL Expenses
	var expenses_fields
  	sheet_name = "PL_Actual_EXPENSES"
  	section_start = ["Expenses", "Depreciation"]
  	section_end   = ["Total Expenses", "Total Depreciation"]

	expenses_fields = generate_fileds_column(sheet_name, section_start, section_end)
	gen_cols.push(expenses_fields)



	//BS Assests
	var assets_fields
  	sheet_name = "BS_Actual_ASSETS"
  	section_start = ["Bank and Cash Accounts", "Receivables", "Current Assets", "Prepayments", "Plus Fixed Assets", "Plus Non-current Assets"]
  	section_end   = ["Total Bank and Cash Accounts", "Total Receivables", "Total Current Assets", "Total Prepayments", "Total Plus Fixed Assets", "Total Plus Non-current Assets"]

	assets_fields = generate_fileds_column(sheet_name, section_start, section_end)
	gen_cols.push(assets_fields)



	//BS Liabilities
	var liabilities_fields
  	sheet_name = "BS_Actual_LIABILITIES"
  	section_start = ["Current Liabilities", "Payables", "Plus Non-current Liabilities","RETAINED EARNINGS"]
  	section_end   = ["Total Current Liabilities", "Total Payables", "Total Plus Non-current Liabilities", "Total RETAINED EARNINGS"]

	liabilities_fields = generate_fileds_column(sheet_name, section_start, section_end)
	gen_cols.push(liabilities_fields)


	//Fill the generated data sheet
	sheet_pos = spsheet.getSheetByName(generated_sheet_name);
  	if (sheet_pos) {
	    sheet_pos.clear();
	    sheet_pos.activate();
  	} else {
	    sheet_pos = spsheet.insertSheet(generated_sheet_name, spsheet.getNumSheets());
  	}

	for(i = 0; i < gen_cols.length; i++) {	  
		sheet_pos.getRange(1, i+1, gen_cols[i].length, 1).setValues(gen_cols[i])
	}
}

