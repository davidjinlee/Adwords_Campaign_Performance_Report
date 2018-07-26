//ADWORDS SCRIPT FOR PULLING REPORTS INTO GOOGLE SHEET
function main() {

// Variable Definition  
  var spreadsheet_url = "URL_TO_SPREADSHEET";
  var date_range = 'LAST_7_DAYS';
  var columns = ['Date',
                 'AccountCurrencyCode',
                 'AccountDescriptiveName',
                 'CustomerDescriptiveName',
                 'ExternalCustomerId',
                 'AdNetworkType1',
                 'AdvertisingChannelType',
                 'PrimaryCompanyName',
                 'CampaignName',
                 'Device',
                 'AveragePosition',                
                 'Clicks',
                 'Cost',
                 'Impressions'];
  var columns_str = columns.join(',') + " ";
   
  var sheet = SpreadsheetApp.openByUrl(spreadsheet_url).getActiveSheet()

// Clean up Spreadsheet
  { sheet.clearContents();
    sheet.clearFormats();
  }
    if(sheet.getRange('A1:A1').getValues()[0][0] == "") {
    sheet.clear();
    sheet.appendRow(columns);
  }
  
// Keep track of the MCC account for future reference.
  var mccAccount = AdWordsApp.currentAccount()
  
// Save MCC Account.  
  var accountSelector = MccApp.accounts().withCondition("Impressions > 0").forDateRange(date_range).withCondition("ENTER_FILTERING_CONDITIONS");
  var accountIterator = accountSelector.get()
  
// Iterate through the list of accounts
  while (accountIterator.hasNext()) {
  var account = accountIterator.next();

// Select the client account.
  MccApp.select(account);
  
// Process your client account here.
    var report_iter = AdWordsApp.report(
    'SELECT ' + columns_str +
    'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
    'WHERE  Impressions > 0 ' +
    'DURING ' +date_range).rows();
    
    while(report_iter.hasNext()) {
    var row = report_iter.next();
    var row_array = [];
    for(var i in columns) {
       row_array.push(row[columns[i]]);
    }
    sheet.appendRow(row_array);   
  }  
  }
// Switch back to MCC account
  MccApp.select(mccAccount);


}
