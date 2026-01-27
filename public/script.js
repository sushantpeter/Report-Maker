/* =====================================================
   Global Variables (temporary client-side state)
===================================================== */

// Counter for multiple Tehsil uploads
let pmKisanCount = 1;
let bucketCount = 1;

/* =====================================================
   Dynamic PM Kisan Upload Section
===================================================== */

function addPmKisanUpload() {
  pmKisanCount++;

  const container = document.getElementById("pmKisanContainer");

  const div = document.createElement("div");
  div.className = "upload-block";

  div.innerHTML = `
    <label>PM Kisan Drill Down Report (Tehsil ${pmKisanCount})</label>
    <input type="file" name="pmkisanFile">
  `;

  container.appendChild(div);
}

/* =====================================================
   Dynamic Bucket Claimed Upload Section
===================================================== */

function addBucketUpload() {
  bucketCount++;

  const container = document.getElementById("bucketContainer");

  const div = document.createElement("div");
  div.className = "upload-block";

  div.innerHTML = `
    <label>Bucket Claimed Report (Tehsil ${bucketCount})</label>
    <input type="file" name="bucketFile">
  `;

  container.appendChild(div);
}

/* =====================================================
   Upload All Files to Server
===================================================== */

async function uploadFiles() {
  const form = document.getElementById("uploadForm");
  const formData = new FormData(form);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    alert("Files uploaded successfully!");
    window.location.href = "report.html";

  } catch (error) {
    alert("Error uploading files");
    console.error(error);
  }
}

/* =====================================================
   Generate Report
===================================================== */

async function generateReport() {
  const config = {
    joinKeys: {
      employee: document.getElementById("empJoinKey").value,
      farmer: document.getElementById("farmerJoinKey").value,
      bucket: document.getElementById("bucketJoinKey").value
    },
    selectedCols: getSelectedColumns(),
    groupBy: document.getElementById("groupBy").value
  };

  const response = await fetch("/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
  });

  const data = await response.json();
  renderTable(data);
}

/* =====================================================
   Helpers
===================================================== */

// Collect selected columns (checkbox based)
function getSelectedColumns() {
  const checkboxes = document.querySelectorAll(
    'input[name="reportColumns"]:checked'
  );

  return Array.from(checkboxes).map(cb => cb.value);
}

// Render report preview table
function renderTable(data) {
  const container = document.getElementById("reportPreview");
  container.innerHTML = "";

  if (!data || data.length === 0) {
    container.innerHTML = "<p>No data available</p>";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Table Header
  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement("th");
    th.innerText = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Table Body
  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(value => {
      const td = document.createElement("td");
      td.innerText = value;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

