const express = require("express");
const multer = require("multer");
const path = require("path");

const { readExcel } = require("./utils/readExcel");
const { generateReport } = require("./utils/reportGenerator");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* ---------------- Upload Config ---------------- */
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  }
});
const upload = multer({ storage });

/* ---------------- Upload API ---------------- */
app.post("/upload", upload.any(), async (req, res) => {
  try {

    // 1️⃣ Safety check
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: "No files received"
      });
    }

    // 2️⃣ Container for all uploaded excel data
    let filesData = {};

    // 3️⃣ Loop through each uploaded file
    for (let file of req.files) {

      // same fieldname की multiple files को array में रखें
      if (!filesData[file.fieldname]) {
        filesData[file.fieldname] = [];
      }

      // excel read करके push करें
      filesData[file.fieldname].push(
		file.fieldname === "employeeFile"
		? readExcel(file.path, { skipFirstRow: true })
        : readExcel(file.path)
      );
    }

    // 4️⃣ Temporarily store globally
    global.uploadedData = filesData;

    // 5️⃣ DEBUG LOG (बहुत ज़रूरी)
    console.log("Uploaded file groups:");
    console.log(Object.keys(filesData));

    res.json({ success: true });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
});


/* ---------------- Get Columns API ---------------- */
app.get("/get-columns", (req, res) => {
  try {
    if (!global.uploadedData) {
      return res.status(400).json({ error: "No data uploaded yet" });
    }

    // Employee file (first file, first sheet)
    const employeeSheets = global.uploadedData.employeeFile[0];
    const empSheetName = Object.keys(employeeSheets)[0];
    const empColumns = Object.keys(employeeSheets[empSheetName][0] || {});

    // Farmer registry (first file, first sheet)
    const farmerSheets = global.uploadedData.farmerFile[0];
    const farmerSheetName = Object.keys(farmerSheets)[0];
    const farmerColumns = Object.keys(farmerSheets[farmerSheetName][0] || {});

    res.json({
  employeeColumns: empColumns,
  farmerColumns: farmerColumns,
  pmkisanColumns: Object.keys(
    global.uploadedData.pmkisanFiles[0][
      Object.keys(global.uploadedData.pmkisanFiles[0])[0]
    ][0] || {}
  ),
  bucketColumns: Object.keys(
    global.uploadedData.bucketFiles[0][
      Object.keys(global.uploadedData.bucketFiles[0])[0]
    ][0] || {}
  )
});


  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





/* ---------------- Generate Report ---------------- */
app.post("/generate-report", (req, res) => {
  try {
    const config = req.body; // user selected columns & grouping
    const report = generateReport(global.uploadedData, config);

    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(3000, () =>
  console.log("Server running on http://localhost:3000")
);
