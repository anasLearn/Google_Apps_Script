function gather_ASSETS_LIABILITIES_for_BS() {
  var folder_in = BS_FOLDER
  var names = ["BS", "ASSETS", "LIABILITIES"]
  var marker = "Current Liabilities"
  
  extract_info(folder_in, names, marker)
}
