function renderScanRfid() {
  return `
    <div class="scan-rfid-container">
      <div class="scan-card">
        <div class="scan-header">
          <h3>Scan RFID</h3>
          <p>Tempelkan kartu RFID siswa untuk mencatat kehadiran</p>
        </div>

        <div class="scan-icon-wrapper">
          <i class="bi bi-upc-scan"></i>
        </div>

        <div id="scan-status">
          <span class="scan-status-badge idle">
            <i class="bi bi-radio"></i> Menunggu scan kartu...
          </span>
        </div>

        <div class="scan-input-group">
          <input
            type="text"
            id="card-id-input"
            class="form-control"
            placeholder="Tempelkan kartu RFID..."
            autofocus
          >
          <button class="scan-btn" onclick="submitScan()">
            <i class="bi bi-upc-scan"></i> Scan Sekarang
          </button>

          <div class="scan-divider">atau</div>

          <button class="inputManual-btn" onclick="submitScan()">
            <i class="bi bi-upc-scan"></i> Input Manual
          </button>
      </div>

        <div id="scan-result"></div>
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
    '<span class="scan-status-badge scanning"><i class="bi bi-arrow-repeat"></i> Memproses...</span>';

  try {
    const response = await fetch(
      "http://localhost:3000/api/attendances/store?idcard=" +
        encodeURIComponent(cardId) +
        "&mac_address=RFID",
      {
        method: "POST",
        headers: { "api-token": "12345" },
      },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      statusEl.innerHTML =
        '<span class="scan-status-badge success"><i class="bi bi-check-circle-fill"></i> Berhasil!</span>';
      resultEl.innerHTML =
        '<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ' +
        (data.message || "Kehadiran berhasil dicatat") +
        "</div>";
      
      // Arahkan ke statistik setelah berhasil
      setTimeout(() => {
        if (typeof navigateTo === "function") {
          navigateTo("scan-rfid");
        } else {
          window.location.href = "/frontEnd/page/structure/dashboard.html";
        }
      }, 1500);
    } else {
      statusEl.innerHTML =
        '<span class="scan-status-badge error"><i class="bi bi-x-circle-fill"></i> Gagal</span>';
      resultEl.innerHTML =
        '<div class="alert alert-danger"><i class="bi bi-x-circle-fill"></i> ' +
        (data.error ||
          data.message ||
          "Gagal mencatat kehadiran (Eror " + response.status + ")") +
        "</div>";
    }
  } catch (error) {
    statusEl.innerHTML = '<span class="scan-status-badge error"><i class="bi bi-wifi-off"></i> Error</span>';
    resultEl.innerHTML =
      '<div class="alert alert-danger"><i class="bi bi-wifi-off"></i> Terjadi kesalahan koneksi ke server</div>';
  }

  document.getElementById("card-id-input").value = "";
  document.getElementById("card-id-input").focus();
}