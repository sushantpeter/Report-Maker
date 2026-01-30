/* =====================================================
   PM Kisan File Selection
===================================================== */

function selectPmKisanFiles() {
  document.getElementById("pmkisanInput").click();
}

document.getElementById("pmkisanInput")?.addEventListener("change", e => {
  const list = document.getElementById("pmkisanFileList");
  list.innerHTML = "";

  Array.from(e.target.files).forEach((file, index) => {
    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${file.name}`;
    list.appendChild(p);
  });
});

/* =====================================================
   Bucket Claimed File Selection
===================================================== */

function selectBucketFiles() {
  document.getElementById("bucketInput").click();
}

document.getElementById("bucketInput")?.addEventListener("change", e => {
  const list = document.getElementById("bucketFileList");
  list.innerHTML = "";

  Array.from(e.target.files).forEach((file, index) => {
    const p = document.createElement("p");
    p.innerText = `${index + 1}. ${file.name}`;
    list.appendChild(p);
  });
});

/* =====================================================
   Upload All Files
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("uploadForm");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const response = await fetch("/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      alert("All files uploaded successfully ✅");
      window.location.href = "report.html";

    } catch (err) {
      alert("Upload failed ❌");
      console.error(err);
    }
  });

});
