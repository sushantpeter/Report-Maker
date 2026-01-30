const XLSX = require("xlsx");

/**
 * Reads all sheets from an Excel file
 */
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  let data = {};

  workbook.SheetNames.forEach(sheet => {
    data[sheet] = function readExcel(filePath, options = {}) {
  const workbook = XLSX.readFile(filePath);
  let data = {};

  workbook.SheetNames.forEach(sheet => {

    const sheetData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet],
      {
        defval: "",
        range: options.skipFirstRow ? 1 : 0
        // range:1 → पहली पंक्ति skip
      }
    );

    data[sheet] = sheetData;
  });

  return data;
}

  });

  return data;
}

module.exports = { readExcel };

