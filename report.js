/* ===============================
   Load Columns on Page Load
================================*/
document.addEventListener("DOMContentLoaded", loadColumns);

async function loadColumns() {
  const res = await fetch("/get-columns");
  const data = await res.json();

  populateDropdown("empJoin", data.employeeColumns);
populateDropdown("farmerJoin", data.farmerColumns);
populateDropdown("pmkisanJoin", data.pmkisanColumns);
populateDropdown("bucketJoin", data.bucketColumns);

  createCheckboxes(data.farmerColumns);
}

/* ===============================
   Helpers
================================*/
function populateDropdown(id, columns) {
  const select = document.getElementById(id);
  columns.forEach(col => {
    const opt = document.createElement("option");
    opt.value = col;
    opt.innerText = col;
    select.appendChild(opt);
  });
}

function createCheckboxes(columns) {
  const container = document.getElementById("columnCheckboxes");
  container.innerHTML = "";

  columns.forEach(col => {
    const label = document.createElement("label");
    label.innerHTML = `
      <input type="checkbox" value="${col}" checked>
      ${col}
    `;
    container.appendChild(label);
  });
}

/* ===============================
   Generate Report
================================*/
async function generateReport() {
  const selectedCols = Array.from(
    document.querySelectorAll("#columnCheckboxes input:checked")
  ).map(cb => cb.value);

  const payload = {
  joinKeys: {
  employee: document.getElementById("empJoin").value,
  farmer: document.getElementById("farmerJoin").value,
  pmkisan: document.getElementById("pmkisanJoin").value,
  bucket: document.getElementById("bucketJoin").value
},
  selectedCols,
  groupBy: document.getElementById("groupBy").value
};

  const res = await fetch("/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  renderTable(data);
}

/* ===============================
   Render Preview Table
================================*/
function renderTable(data) {
  const div = document.getElementById("reportPreview");
  div.innerHTML = "";

  if (!data || data.length === 0) {
    div.innerHTML = "<p>No data</p>";
    return;
  }

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement("th");
    th.innerText = key;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(val => {
      const td = document.createElement("td");
      td.innerText = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  div.appendChild(table);
}
