/**
 * Main report generation logic
 */
function generateReport(uploadedData, config) {

  const {
    joinKeys,     // { employee: "PatwariCode", farmer: "PatwariCode" }
    selectedCols,
    groupBy
  } = config;

  let employees = uploadedData.employeeFile.Sheet1;
  let farmerData = uploadedData.farmerFile.Sheet1;
  let bucketData = uploadedData.bucketFile.Sheet1;

  /* ---------- Merge using Primary Key ---------- */
  let merged = farmerData.map(f => {
    let emp = employees.find(
      e => e[joinKeys.employee] === f[joinKeys.farmer]
    ) || {};

    let bucket = bucketData.find(
      b => b[joinKeys.bucket] === f[joinKeys.farmer]
    ) || {};

    return {
      ...f,
      ...emp,
      ...bucket
    };
  });

  /* ---------- Grouping ---------- */
  let grouped = {};
  merged.forEach(row => {
    let key = row[groupBy];
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(row);
  });

  /* ---------- Build Final Output ---------- */
  let report = [];
  for (let key in grouped) {
    let obj = {};
    selectedCols.forEach(col => {
      obj[col] = grouped[key].reduce(
        (sum, r) => sum + Number(r[col] || 0),
        0
      );
    });
    obj[groupBy] = key;
    report.push(obj);
  }

  return report;
}

module.exports = { generateReport };

