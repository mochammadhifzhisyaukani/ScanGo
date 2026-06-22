function renderScanRfid() {
  return `
        <div class="scan-rfid-container">
            <div class="scan-header">
                <h3><i class="bi bi-upc-scan"></i> Scan RFID</h3>
                <p class="text-muted">Scan kartu RFID siswa untuk mencatat kehadiran</p>
            </div>
            <div class="scan-body text-center">
                <div class="scan-animation mb-4">
                    <i class="bi bi-upc-scan" style="font-size: 80px; color: var(--primary-color);"></i>
                </div>
                <div id="scan-status" class="mb-3">
                    <span class="badge bg-secondary p-2 fs-6">Menunggu scan kartu...</span>
                </div>
                <div class="scan-input-group mb-3">
                    <input type="text" id="card-id-input" class="form-control form-control-lg text-center" placeholder="Tempelkan kartu RFID..." autofocus>
                    <button class="btn btn-primary btn-lg mt-2" onclick="submitScan()">
                        <i class="bi bi-search"></i> Cari
                    </button>
                </div>
                <div id="scan-result" class="mt-3"></div>
            </div>
        </div>
    `;
}

function initScanRfid() {
  const input = document.getElementById("card-id-input");
  if (input) {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        submitScan();
      }
    });
    setTimeout(() => input.focus(), 100);
  }
}

async function submitScan() {
  const cardId = document.getElementById("card-id-input").value.trim();
  if (!cardId) {
    showToast("warning", "Masukkan ID kartu RFID terlebih dahulu");
    return;
  }

  const statusEl = document.getElementById("scan-status");
  const resultEl = document.getElementById("scan-result");
  statusEl.innerHTML =
    '<span class="badge bg-warning p-2 fs-6">Memproses...</span>';

  try {
    const response = await fetch(
      "http://localhost:3000/api/attendances/store?card_id=" +
        encodeURIComponent(cardId) +
        "&mac_address=RFID Reader",
      {
        method: "POST",
        headers: { "api-token": "12345" },
      },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      statusEl.innerHTML =
        '<span class="badge bg-success p-2 fs-6">Berhasil!</span>';
      resultEl.innerHTML =
        '<div class="alert alert-success">' +
        (data.message || "Kehadiran berhasil dicatat") +
        "</div>";
    } else {
      statusEl.innerHTML =
        '<span class="badge bg-danger p-2 fs-6">Gagal</span>';
      resultEl.innerHTML =
        '<div class="alert alert-danger">' +
        (data.error ||
          data.message ||
          "Gagal mencatat kehadiran (Eror " + response.status + ")") +
        "</div>";
    }
  } catch (error) {
    statusEl.innerHTML = '<span class="badge bg-danger p-2 fs-6">Error</span>';
    resultEl.innerHTML =
      '<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>';
  }

  document.getElementById("card-id-input").value = "";
  document.getElementById("card-id-input").focus();
}
