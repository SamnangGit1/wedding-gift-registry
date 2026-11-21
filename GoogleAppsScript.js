/**
 * =======================================================================
 * Google Sheets Template & Real-Time Sync for Wedding Gift / Village Records
 * សៀវភៅកត់ចំណងដៃអាពាហ៍ពិពាហ៍ (Khmer OS Siemreap)
 * Multi-user Real-Time Support (3-4 users concurrent input)
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1nMmJ7VBqVhFn6Efu_0Rm3clNxsbLBhAyluWpcGU1W58/edit
 * =======================================================================
 */

var SPREADSHEET_ID = "1nMmJ7VBqVhFn6Efu_0Rm3clNxsbLBhAyluWpcGU1W58";

function getSpreadsheet() {
  var ss = null;
  try { ss = SpreadsheetApp.getActiveSpreadsheet(); } catch (e) {}
  if (!ss) {
    try { ss = SpreadsheetApp.openById(SPREADSHEET_ID); } catch (e) {}
  }
  return ss;
}

// 1. GENERATE BEAUTIFUL TEMPLATE WITH 'Khmer OS Siemreap' FONT
function setupTemplate() {
  var ss = getSpreadsheet();
  if (!ss) {
    Logger.log("❌ Could not open spreadsheet: " + SPREADSHEET_ID);
    return;
  }

  var sheet = ss.getSheetByName("Wedding Gifts") || ss.getActiveSheet();
  sheet.setName("Wedding Gifts");
  sheet.clear();
  sheet.setFrozenRows(5);
  
  sheet.setColumnWidth(1, 60);  // No.
  sheet.setColumnWidth(2, 200); // Name
  sheet.setColumnWidth(3, 150); // Village
  sheet.setColumnWidth(4, 150); // Commune
  sheet.setColumnWidth(5, 130); // Amount
  sheet.setColumnWidth(6, 110); // Currency
  sheet.setColumnWidth(7, 230); // Note
  sheet.setColumnWidth(8, 130); // Recorder
  sheet.setColumnWidth(9, 160); // Date & Time

  // Title Banner
  var titleRange = sheet.getRange("A1:I1");
  titleRange.merge();
  titleRange.setValue("សៀវភៅកត់ត្រាចំណងដៃអាពាហ៍ពិពាហ៍ · WEDDING GIFT REGISTRY");
  titleRange.setBackground("#0b8f6a");
  titleRange.setFontColor("#ffffff");
  titleRange.setFontSize(15);
  titleRange.setFontWeight("bold");
  titleRange.setHorizontalAlignment("center");
  titleRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 46);

  // Summary Cards
  sheet.getRange("B3:C3").merge().setValue("សរុបដុល្លារ (Total USD)")
    .setFontWeight("bold").setFontColor("#475569").setFontSize(11).setHorizontalAlignment("center").setBackground("#ecfdf5");
  sheet.getRange("B4:C4").merge().setFormula('=IFERROR(SUMIF(F6:F, "USD", E6:E), 0)')
    .setFontWeight("bold").setFontSize(17).setFontColor("#0b8f6a").setHorizontalAlignment("center").setNumberFormat("$#,##0.00").setBackground("#ecfdf5");

  sheet.getRange("D3:E3").merge().setValue("សរុបរៀល (Total KHR)")
    .setFontWeight("bold").setFontColor("#475569").setFontSize(11).setHorizontalAlignment("center").setBackground("#f8fafc");
  sheet.getRange("D4:E4").merge().setFormula('=IFERROR(SUMIF(F6:F, "KHR", E6:E), 0)')
    .setFontWeight("bold").setFontSize(17).setFontColor("#1e293b").setHorizontalAlignment("center").setNumberFormat('#,##0 "៛"').setBackground("#f8fafc");

  sheet.getRange("F3:G3").merge().setValue("ចំនួនភ្ញៀវសរុប (Total Guests)")
    .setFontWeight("bold").setFontColor("#475569").setFontSize(11).setHorizontalAlignment("center").setBackground("#ecfdf5");
  sheet.getRange("F4:G4").merge().setFormula('=IFERROR(COUNTA(B6:B), 0)')
    .setFontWeight("bold").setFontSize(17).setFontColor("#0b8f6a").setHorizontalAlignment("center").setNumberFormat('#,##0').setBackground("#ecfdf5");

  sheet.getRange("B3:C4").setBorder(true, true, true, true, false, false, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange("D3:E4").setBorder(true, true, true, true, false, false, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange("F3:G4").setBorder(true, true, true, true, false, false, "#cbd5e1", SpreadsheetApp.BorderStyle.SOLID);

  // Table Headers
  var headers = [["ល.រ\n(No.)", "ឈ្មោះអ្នកចងដៃ\n(Guest Name)", "ភូមិ\n(Village)", "ឃុំ / សង្កាត់\n(Commune)", "ចំនួនទឹកប្រាក់\n(Amount)", "រូបិយប័ណ្ណ\n(Currency)", "ចំណាំ\n(Note)", "អ្នកកត់ត្រា\n(Recorder)", "កាលបរិច្ឆេទ\n(Recorded Time)"]];
  var hRange = sheet.getRange("A5:I5");
  hRange.setValues(headers);
  hRange.setBackground("#12202e");
  hRange.setFontColor("#ffffff");
  hRange.setFontWeight("bold");
  hRange.setFontSize(11);
  hRange.setHorizontalAlignment("center");
  hRange.setVerticalAlignment("middle");
  sheet.setRowHeight(5, 42);

  sheet.getRange("A6:A1000").setHorizontalAlignment("center");
  sheet.getRange("B6:D1000").setHorizontalAlignment("left");
  sheet.getRange("E6:E1000").setHorizontalAlignment("right").setNumberFormat("#,##0.00");
  sheet.getRange("F6:F1000").setHorizontalAlignment("center");
  sheet.getRange("H6:H1000").setHorizontalAlignment("center");
  sheet.getRange("I6:I1000").setHorizontalAlignment("center").setFontColor("#64748b");

  var rule = SpreadsheetApp.newDataValidation().requireValueInList(["USD", "KHR"], true).setAllowInvalid(false).build();
  sheet.getRange("F6:F1000").setDataValidation(rule);

  sheet.getRange("A1:I1000").setFontFamily("Khmer OS Siemreap");
  Logger.log("✅ Successfully generated template for: " + SPREADSHEET_ID);
}

// 2. RECEIVE REAL-TIME DATA: ADD, UPDATE, DELETE (POST)
function doPost(e) {
  var lock = LockService.getScriptLock();
  try { lock.waitLock(30000); } catch (err) { return createJsonResponse({ status: "error", message: "Server busy" }); }
  try {
    var ss = getSpreadsheet();
    if (!ss) return createJsonResponse({ status: "error", message: "Spreadsheet not found" });

    var sheet = ss.getSheetByName("Wedding Gifts") || ss.getActiveSheet();
    var postData = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    var data = {};
    try { data = JSON.parse(postData); } catch(err) { data = (e && e.parameter) ? e.parameter : {}; }

    var lastRow = sheet.getLastRow();

    // ACTION: UPDATE RECORD
    if (data.action === "update" && data.no) {
      for (var r = 6; r <= lastRow; r++) {
        if (sheet.getRange(r, 1).getValue() == data.no) {
          var price = parseFloat(data.price) || 0;
          var currency = (data.currency || "USD").toUpperCase();
          if (currency !== "KHR" && currency !== "USD") currency = "USD";
          sheet.getRange(r, 2, 1, 7).setValues([[
            data.name || "",
            data.village || "",
            data.commune || "",
            price,
            currency,
            data.note || "",
            data.user || "User 1"
          ]]);
          return createJsonResponse({ status: "success", action: "update", row: r });
        }
      }
    }

    // ACTION: DELETE RECORD
    if (data.action === "delete" && data.no) {
      for (var r = 6; r <= lastRow; r++) {
        if (sheet.getRange(r, 1).getValue() == data.no) {
          sheet.deleteRow(r);
          // Renumber rows
          var newLast = sheet.getLastRow();
          for (var k = 6; k <= newLast; k++) {
            sheet.getRange(k, 1).setValue(k - 5);
          }
          return createJsonResponse({ status: "success", action: "delete", row: r });
        }
      }
    }

    // ACTION: ADD OR BATCH
    var records = Array.isArray(data.records) ? data.records : (data.name ? [data] : []);
    if (records.length === 0) return createJsonResponse({ status: "error", message: "No records found" });

    var startRow = Math.max(6, sheet.getLastRow() + 1);
    var rowsToAdd = [];
    var now = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || "Asia/Phnom_Penh", "yyyy-MM-dd HH:mm:ss");

    for (var i = 0; i < records.length; i++) {
      var r = records[i];
      var price = parseFloat(String(r.price).replace(/,/g, "")) || 0;
      var currency = String(r.currency || "USD").toUpperCase();
      if (currency === "៛" || currency.indexOf("រៀល") > -1) currency = "KHR";
      if (currency !== "KHR" && currency !== "USD") currency = "USD";
      rowsToAdd.push([(startRow - 5) + i, r.name || "", r.village || "", r.commune || "", price, currency, r.note || "", r.user || "User 1", r.timestamp || now]);
    }
    if (rowsToAdd.length > 0) {
      sheet.getRange(startRow, 1, rowsToAdd.length, 9).setValues(rowsToAdd);
      sheet.getRange(startRow, 1, rowsToAdd.length, 9).setFontFamily("Khmer OS Siemreap");
      for (var j = 0; j < rowsToAdd.length; j++) {
        var rIdx = startRow + j;
        sheet.getRange(rIdx, 1, 1, 9).setBackground(rIdx % 2 === 0 ? "#ffffff" : "#f8fafc");
      }
    }
    return createJsonResponse({ status: "success", count: rowsToAdd.length });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// 3. STREAM DATA (GET)
function doGet(e) {
  try {
    var ss = getSpreadsheet();
    if (!ss) return createJsonResponse({ status: "error", message: "Spreadsheet not found" });

    var sheet = ss.getSheetByName("Wedding Gifts") || ss.getActiveSheet();
    var action = (e && e.parameter && e.parameter.action) || "read";
    if (action === "setup") { setupTemplate(); return createJsonResponse({ status: "success" }); }

    var lastRow = sheet.getLastRow();
    if (lastRow < 6) return createJsonResponse({ status: "success", records: [], count: 0 });
    var numCols = Math.min(sheet.getLastColumn(), 9);
    var data = sheet.getRange(6, 1, lastRow - 5, numCols).getValues();
    var records = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      if (!row[1] && !row[4]) continue;
      var cur = String(row[5] || "USD").toUpperCase();
      if (cur === "៛" || cur.indexOf("រៀល") > -1) cur = "KHR";
      if (cur !== "KHR" && cur !== "USD") cur = "USD";
      records.push({
        id: "gs_" + row[0],
        no: row[0],
        name: String(row[1] || "").trim(),
        village: String(row[2] || "").trim(),
        commune: String(row[3] || "").trim(),
        price: parseFloat(String(row[4] || 0).replace(/,/g, "")) || 0,
        currency: cur,
        note: String(row[6] || "").trim(),
        user: String(row[7] || "User 1").trim(),
        timestamp: String(row[8] || "")
      });
    }
    return createJsonResponse({ status: "success", records: records, count: records.length, serverTime: Date.now() });
  } catch (error) {
    return createJsonResponse({ status: "error", message: error.toString() });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
