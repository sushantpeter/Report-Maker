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
    let filesData = {};

    for (let file of req.files) {
      if (!filesData[file.fieldname]) {
        filesData[file.fieldname] = [];
        }

      filesData[file.fieldname].push(readExcel(file.path));
    }

    // temporary global storage (later DB / session)
    global.uploadedData = filesData;

    res.json({ success: true });
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
