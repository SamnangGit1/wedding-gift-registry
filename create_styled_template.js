const ExcelJS = require('exceljs');
const path = require('path');

async function createStyledTemplate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Village Records';
  const sheet = workbook.addWorksheet('Wedding Gifts', {
    views: [{ state: 'frozen', ySplit: 5 }],
    pageSetup: { fitToPage: true, fitToWidth: 1, orientation: 'landscape' }
  });

  const FONT_NAME = 'Khmer OS Siemreap';

  // Set column widths directly (DO NOT use sheet.columns which overwrites Row 1)
  const colWidths = [8, 25, 18, 18, 16, 12, 25, 14, 22];
  colWidths.forEach((w, i) => {
    sheet.getColumn(i + 1).width = w;
  });

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
    right: { style: 'thin', color: { argb: 'FFCBD5E1' } }
  };

  // 1. Title Banner (A1:I1)
  sheet.mergeCells('A1:I1');
  const titleCell = sheet.getCell('A1');
  titleCell.value = 'សៀវភៅកត់ត្រាចំណងដៃអាពាហ៍ពិពាហ៍ · WEDDING GIFT REGISTRY';
  titleCell.font = { name: FONT_NAME, size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0B8F6A' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  sheet.getRow(1).height = 42;
  sheet.getRow(2).height = 12;

  // 2. Summary KPI Cards (Rows 3-4)
  // Total USD (B3:C4)
  sheet.mergeCells('B3:C3');
  const b3 = sheet.getCell('B3');
  b3.value = 'សរុបដុល្លារ (Total USD)';
  b3.font = { name: FONT_NAME, size: 10, bold: true, color: { argb: 'FF475569' } };
  b3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
  b3.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells('B4:C4');
  const b4 = sheet.getCell('B4');
  b4.value = { formula: 'IFERROR(SUMIF(F6:F1000, "USD", E6:E1000), 0)' };
  b4.numFmt = '$#,##0.00';
  b4.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF0B8F6A' } };
  b4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
  b4.alignment = { horizontal: 'center', vertical: 'middle' };

  // Total KHR (D3:E4)
  sheet.mergeCells('D3:E3');
  const d3 = sheet.getCell('D3');
  d3.value = 'សរុបរៀល (Total KHR)';
  d3.font = { name: FONT_NAME, size: 10, bold: true, color: { argb: 'FF475569' } };
  d3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  d3.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells('D4:E4');
  const d4 = sheet.getCell('D4');
  d4.value = { formula: 'IFERROR(SUMIF(F6:F1000, "KHR", E6:E1000), 0)' };
  d4.numFmt = '#,##0 "៛"';
  d4.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF1E293B' } };
  d4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
  d4.alignment = { horizontal: 'center', vertical: 'middle' };

  // Total Guests (F3:G4)
  sheet.mergeCells('F3:G3');
  const f3 = sheet.getCell('F3');
  f3.value = 'ចំនួនភ្ញៀវសរុប (Total Guests)';
  f3.font = { name: FONT_NAME, size: 10, bold: true, color: { argb: 'FF475569' } };
  f3.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
  f3.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.mergeCells('F4:G4');
  const f4 = sheet.getCell('F4');
  f4.value = { formula: 'IFERROR(COUNTA(B6:B1000), 0)' };
  f4.numFmt = '#,##0';
  f4.font = { name: FONT_NAME, size: 16, bold: true, color: { argb: 'FF0B8F6A' } };
  f4.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFECFDF5' } };
  f4.alignment = { horizontal: 'center', vertical: 'middle' };

  sheet.getRow(3).height = 20;
  sheet.getRow(4).height = 28;

  ['B3', 'C3', 'B4', 'C4', 'D3', 'E3', 'D4', 'E4', 'F3', 'G3', 'F4', 'G4'].forEach(cellRef => {
    sheet.getCell(cellRef).border = thinBorder;
  });

  // 3. Table Headers explicitly on Row 5
  const row5 = sheet.getRow(5);
  row5.values = [
    'ល.រ (No.)',
    'ឈ្មោះអ្នកចងដៃ (Guest Name)',
    'ភូមិ (Village)',
    'ឃុំ / សង្កាត់ (Commune)',
    'ចំនួនទឹកប្រាក់ (Amount)',
    'រូបិយប័ណ្ណ (Currency)',
    'ចំណាំ (Note)',
    'អ្នកកត់ត្រា (Recorder)',
    'កាលបរិច្ឆេទ (Recorded Time)'
  ];
  row5.height = 36;

  for (let c = 1; c <= 9; c++) {
    const cell = row5.getCell(c);
    cell.font = { name: FONT_NAME, size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF12202E' } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = thinBorder;
  }

  // 4. Sample Rows
  const sampleData = [
    [1, 'សុខ ចាន់ដារា', 'ភូមិត្រពាំងថ្លឹង', 'ឃុំចោមចៅ', 50, 'USD', 'មិត្តភក្តិ', 'User 1', '2026-11-21 10:00:00'],
    [2, 'គង់ ពិសី', 'ភូមិព្រៃស', 'ឃុំព្រៃស', 200000, 'KHR', 'បងប្អូនជីដូនមួយ', 'User 2', '2026-11-21 10:15:00'],
    [3, 'លី វណ្ណៈ', 'ភូមិកំបូល', 'ឃុំកំបូល', 100, 'USD', 'មិត្តរួមការងារ', 'User 1', '2026-11-21 10:30:00']
  ];

  sampleData.forEach((rowValues, i) => {
    const row = sheet.getRow(6 + i);
    row.values = rowValues;
    row.height = 24;

    const bgArgb = i % 2 === 0 ? 'FFFFFFFF' : 'FFF8FAFC';
    for (let c = 1; c <= 9; c++) {
      const cell = row.getCell(c);
      cell.font = { name: FONT_NAME, size: 10 };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgArgb } };
      cell.border = thinBorder;
      if (c === 1 || c === 6 || c === 8 || c === 9) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (c === 5) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
        cell.numFmt = '#,##0.00';
      } else {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
    }
  });

  const outPath = path.join(__dirname, 'Wedding_Gift_Google_Sheets_Template.xlsx');
  await workbook.xlsx.writeFile(outPath);
  console.log('Fixed template saved successfully to:', outPath);
}

createStyledTemplate().catch(console.error);
