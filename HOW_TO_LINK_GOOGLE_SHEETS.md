# 📋 ការណែនាំ៖ ភ្ជាប់ Village Records ជាមួយ Google Sheets និងបង្កើត Template គំរូ
# Guide: Link Village Records to Google Sheets & Generate Template

សៀវភៅបញ្ជី Google Sheet របស់អ្នក / Your Google Sheet Link:
👉 [https://docs.google.com/spreadsheets/d/1nMmJ7VBqVhFn6Efu_0Rm3clNxsbLBhAyluWpcGU1W58/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1nMmJ7VBqVhFn6Efu_0Rm3clNxsbLBhAyluWpcGU1W58/edit?usp=sharing)

---

## 🚀 វិធីទី ១៖ បង្កើត Template ក្នុង Google Sheet របស់អ្នកដោយស្វ័យប្រវត្តិ (1-Click Google Apps Script)

យើងបានរៀបចំកូដ Script ពេញលេញក្នុងឯកសារ [GoogleAppsScript.js](file:///c:/Users/USER/Downloads/WeddingGift/GoogleAppsScript.js) ។ សូមធ្វើតាម ៤ ជំហានងាយៗ៖

### ជំហានទី ១ (Step 1):
1. បើកតំណភ្ជាប់ Google Sheet របស់អ្នក៖ [Google Sheet Link](https://docs.google.com/spreadsheets/d/1nMmJ7VBqVhFn6Efu_0Rm3clNxsbLBhAyluWpcGU1W58/edit?usp=sharing)
2. នៅលើ Menu ខាងលើ ចុចលើ **Extensions** (ផ្នែកបន្ថែម) ➔ **Apps Script**

### ជំហានទី ២ (Step 2):
1. លុបកូដចាស់ក្នុងផ្ទាំង `Code.gs` ចោលទាំងអស់
2. បើកឯកសារ [GoogleAppsScript.js](file:///c:/Users/USER/Downloads/WeddingGift/GoogleAppsScript.js) ចម្លងកូដទាំងអស់ (Ctrl+A ➔ Ctrl+C) រួចយកទៅបិទភ្ជាប់ (Ctrl+V) ក្នុងផ្ទាំង Apps Script នោះ
3. ចុចប៊ូតុង **Save** 💾 (ឬចុច `Ctrl + S`)

### ជំហានទី ៣៖ បង្កើតទម្រង់ Template ភ្លាមៗ (Step 3 - Run Template):
1. នៅត្រង់បញ្ជី Function ខាងលើ ជ្រើសរើសពាក្យ **`setupTemplate`**
2. ចុចប៊ូតុង **Run** (ដំណើរការ ▶)
3. *ប្រសិនបើ Google សួររក Permission៖ ចុច Review Permissions ➔ ជ្រើសរើស Account របស់អ្នក ➔ Advanced ➔ Go to ... (unsafe) ➔ Allow*
4. ត្រឡប់មកមើល Google Sheet របស់អ្នក នោះអ្នកនឹងឃើញ៖
   - ក្បាលតារាងពណ៌បៃតងស្អាត៖ **សៀវភៅកត់ត្រាចំណងដៃអាពាហ៍ពិពាហ៍ · WEDDING GIFT REGISTRY**
   - ប្រអប់សង្ខេបស្វ័យប្រវត្តិកំពូល (KPI Cards):
     * **សរុបដុល្លារ (Total USD)**: `=SUMIF(F6:F, "USD", E6:E)`
     * **សរុបរៀល (Total KHR)**: `=SUMIF(F6:F, "KHR", E6:E)`
     * **ចំនួនភ្ញៀវសរុប (Total Guests)**: `=COUNTA(B6:B)`
   - ជួរឈរទិន្នន័យ (Columns): ល.រ, ឈ្មោះអ្នកចងដៃ, ភូមិ, ឃុំ/សង្កាត់, ចំនួនទឹកប្រាក់, រូបិយប័ណ្ណ (Dropdown: USD/KHR), ចំណាំ, កាលបរិច្ឆេទ

---

## ⚡ វិធីទី ២៖ ភ្ជាប់ឱ្យទិន្នន័យពី Web App រត់ចូល Google Sheet ផ្ទាល់ (Live Sync)

នៅពេលដែលអ្នកកត់ត្រាភ្ញៀវក្នុង [Village Records.html](file:///c:/Users/USER/Downloads/WeddingGift/Village%20Records.html) ទិន្នន័យនឹងត្រូវបញ្ជូនទៅ Google Sheet ភ្លាមៗ៖

1. នៅក្នុងផ្ទាំង Google Apps Script ដដែល៖
   - ចុចប៊ូតុងពណ៌ខៀវ **Deploy** (ដាក់ឱ្យប្រើ) ➔ **New deployment**
   - ចុចរូបកង់ធ្មេញ (Select type) ➔ ជ្រើសរើស **Web app**
   - Description: `Wedding Gift Sync`
   - Execute as: **Me** (Email របស់អ្នក)
   - Who has access: **Anyone** (អ្នកណាក៏បាន)
   - ចុច **Deploy**
2. ចម្លងយក **Web app URL** (មានទម្រង់៖ `https://script.google.com/macros/s/.../exec`)
3. បើកកម្មវិធី [Village Records.html](file:///c:/Users/USER/Downloads/WeddingGift/Village%20Records.html) ➔ ចុចប៊ូតុង **Google Sheets Sync**
4. បិទភ្ជាប់ (Paste) Web app URL ចូលក្នុងប្រអប់ រួចចុច **Save Settings**
5. រួចរាល់! ឥឡូវរាល់ពេលអ្នកបន្ថែមភ្ញៀវថ្មី វានឹងកត់ត្រាចូល Google Sheet របស់អ្នកដោយស្វ័យប្រវត្តិ។ អ្នកក៏អាចចុច **Push all local records to Google Sheet** ដើម្បីបញ្ជូនទិន្នន័យចាស់ៗទាំងអស់ឡើងទៅ Google Sheet ក្នុងពេលតែមួយផងដែរ!

---

## 📁 វិធីទី ៣៖ ប្រើប្រាស់ឯកសារ Template (.xlsx) ស្រាប់
ប្រសិនបើអ្នកចង់ Import Template ស្រាប់ចូល Google Sheets ឬបើកក្នុង Microsoft Excel៖
- ឯកសារ [Wedding_Gift_Google_Sheets_Template.xlsx](file:///c:/Users/USER/Downloads/WeddingGift/Wedding_Gift_Google_Sheets_Template.xlsx) ត្រូវបានបង្កើតរួចជាស្រេចនៅក្នុង Folder នេះ!
- គ្រាន់តែចូល Google Drive ➔ ចុច **New** ➔ **File upload** ➔ ជ្រើសរើសឯកសារនេះ រួចបើកជាមួយ **Google Sheets** ជាការស្រេច។
