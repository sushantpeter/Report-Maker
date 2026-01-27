const XLSX = require("xlsx");

/**
 * Reads all sheets from an Excel file
 */
function readExcel(filePath) {
  const workbook = XLSX.readFile(filePath);
  let data = {};

  workbook.SheetNames.forEach(sheet => {
    data[sheet] = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet],
      { defval: "" }
    );
  });

  return data;
}

module.exports = { readExcel };

