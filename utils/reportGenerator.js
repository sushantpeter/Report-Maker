const { mergeAllData } = require("./mergeData");

/**
 * Generate grouped report
 */
function generateReport(uploadedData, config) {

  const {
    joinKeys,
    selectedCols,
    groupBy
  } = config;

  // 1️⃣ Merge everything
  const mergedData = mergeAllData(uploadedData, joinKeys);

  // 2️⃣ Grouping
  const grouped = {};

  mergedData.forEach(row => {
    const key = row[groupBy] || "UNKNOWN";

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  });

  // 3️⃣ Aggregation
  const report = [];

  for (let key in grouped) {
    let obj = { [groupBy]: key };

    selectedCols.forEach(col => {
      obj[col] = grouped[key].reduce((sum, r) => {
        const val = Number(r[col]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    });

    report.push(obj);
  }

  return report;
}

module.exports = { generateReport };
