const XLSX = require('xlsx');
const path = require('path');

const ws_data = [
  ['សៀវភៅកត់ត្រាចំណងដៃអាពាហ៍ពិពាហ៍ · WEDDING GIFT REGISTRY', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', 'សរុបដុល្លារ (Total USD)', '', 'សរុបរៀល (Total KHR)', '', 'ចំនួនភ្ញៀវសរុប (Total Guests)', '', ''],
  ['', { t: 'n', f: 'IFERROR(SUMIF(F6:F1000, "USD", E6:E1000), 0)' }, '', { t: 'n', f: 'IFERROR(SUMIF(F6:F1000, "KHR", E6:E1000), 0)' }, '', { t: 'n', f: 'IFERROR(COUNTA(B6:B1000), 0)' }, '', ''],
  ['ល.រ (No.)', 'ឈ្មោះអ្នកចងដៃ (Guest Name)', 'ភូមិ (Village)', 'ឃុំ / សង្កាត់ (Commune)', 'ចំនួនទឹកប្រាក់ (Amount)', 'រូបិយប័ណ្ណ (Currency)', 'ចំណាំ (Note)', 'កាលបរិច្ឆេទ (Recorded Time)'],
  [1, 'សុខ ចាន់ដារា', 'ភូមិត្រពាំងថ្លឹង', 'ឃុំចោមចៅ', 50, 'USD', 'មិត្តភក្តិ', '2026-11-21 10:00'],
  [2, 'គង់ ពិសី', 'ភូមិព្រៃស', 'ឃុំព្រៃស', 200000, 'KHR', 'បងប្អូនជីដូនមួយ', '2026-11-21 10:15'],
  [3, 'លី វណ្ណៈ', 'ភូមិកំបូល', 'ឃុំកំបូល', 100, 'USD', 'មិត្តរួមការងារ', '2026-11-21 10:30']
];

const ws = XLSX.utils.aoa_to_sheet(ws_data);

// Merges
ws['!merges'] = [
  { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }, // Banner A1:H1
  { s: { r: 2, c: 1 }, e: { r: 2, c: 2 } }, // USD header B3:C3
  { s: { r: 3, c: 1 }, e: { r: 3, c: 2 } }, // USD formula B4:C4
  { s: { r: 2, c: 3 }, e: { r: 2, c: 4 } }, // KHR header D3:E3
  { s: { r: 3, c: 3 }, e: { r: 3, c: 4 } }, // KHR formula D4:E4
  { s: { r: 2, c: 5 }, e: { r: 2, c: 6 } }, // Count header F3:G3
  { s: { r: 3, c: 5 }, e: { r: 3, c: 6 } }  // Count formula F4:G4
];

// Column widths
ws['!cols'] = [
  { wch: 10 }, // No.
  { wch: 25 }, // Name
  { wch: 20 }, // Village
  { wch: 20 }, // Commune
  { wch: 16 }, // Amount
  { wch: 14 }, // Currency
  { wch: 30 }, // Note
  { wch: 20 }  // Date
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Wedding Gifts');

const outPath = path.join(__dirname, 'Wedding_Gift_Google_Sheets_Template.xlsx');
XLSX.writeFile(wb, outPath);
console.log('Template created successfully at:', outPath);
