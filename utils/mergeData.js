/**
 * Combine multiple tehsil files into single array
 */
function flattenTehsilFiles(filesArray) {
  let combined = [];

  filesArray.forEach(fileObj => {
    const sheetName = Object.keys(fileObj)[0];
    const rows = fileObj[sheetName] || [];
    combined = combined.concat(rows);
  });

  return combined;
}

/**
 * Merge all data sources using join keys
 */
function mergeAllData(uploadedData, joinKeys) {

  // 1️⃣ Employee / Location
  const empSheet = uploadedData.employeeFile[0];
  const empSheetName = Object.keys(empSheet)[0];
  const employees = empSheet[empSheetName];

  // 2️⃣ Farmer Registry (Sheet1 assumed main)
  const farmerSheet = uploadedData.farmerFile[0];
  // Only Village sheet
if (!farmerSheet.Village) {
  throw new Error("Village sheet not found in Farmer Registry Excel");
}

const farmers = farmerSheet.Village;

  // 3️⃣ PM Kisan (multiple tehsils → one array)
  const pmKisanData = flattenTehsilFiles(
    uploadedData.pmkisanFiles || []
  );

  // 4️⃣ Bucket Claimed (multiple tehsils → one array)
  const bucketData = flattenTehsilFiles(
    uploadedData.bucketFiles || []
  );

  // 5️⃣ Final merge
  const merged = farmers.map(farmer => {

    const emp = employees.find(
      e => e[joinKeys.employee] === farmer[joinKeys.farmer]
    ) || {};

    const pm = pmKisanData.find(
      p => p[joinKeys.pmkisan] === farmer[joinKeys.farmer]
    ) || {};

    const bucket = bucketData.find(
      b => b[joinKeys.bucket] === farmer[joinKeys.farmer]
    ) || {};

    return {
      ...farmer,
      ...emp,
      ...pm,
      ...bucket
    };
  });

  return merged;
}

module.exports = { mergeAllData };
