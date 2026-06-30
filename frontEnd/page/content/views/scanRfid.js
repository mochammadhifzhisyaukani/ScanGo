function renderScanRfid() {
  return `
    <div class="scan-rfid-container">
      
      <div class="scan-card" id="container-scan-rfid">
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

          <button class="inputManual-btn" onclick="toggleAbsenMode('manual')">
            <i class="bi bi-pencil-square"></i> Input Manual
          </button>
        </div>

        <div id="scan-result"></div>
      </div>

      <div class="scan-card" id="container-input-manual" style="display: none;">
        <div class="scan-header" style="margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <h3>Input Manual</h3>
          <p>Pilih nama dan isi keterangan absensi siswa</p>
        </div>

        <div class="scan-input-group" style="text-align: left; gap: 15px;">
          
          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Nama Siswa</label>
            <input type="text" id="manual-nama" class="form-control" placeholder="Ketik nama siswa..." style="width: 100%;">
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Status Kehadiran</label>
            <select id="manual-status" class="form-control" style="width: 100%; background-color: #fff;">
              <option value="Hadir">Hadir</option>
              <option value="Sakit">Sakit</option>
              <option value="Izin">Izin</option>
              <option value="Alfa">Alfa</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.85rem; font-weight: 600; color: #444; display: block; margin-bottom: 5px;">Keterangan</label>
            <textarea id="manual-keterangan" class="form-control" rows="3" placeholder="Tulis alasan atau keterangan di sini..." style="width: 100%; height: auto; padding: 8px 12px;"></textarea>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button class="scan-btn" onclick="submitManual()" style="flex: 2; background-color: #28a745;">
              <i class="bi bi-check-circle"></i> Simpan Absen
            </button>
            <button class="inputManual-btn" onclick="toggleAbsenMode('scan')" style="flex: 1; margin: 0;">
              Batal
            </button>
          </div>

        </div>

        <div id="manual-result" style="margin-top: 15px;"></div>
      </div>

    </div>
  `;
}

function toggleAbsenMode(mode) {
  const scanContainer = document.getElementById("container-scan-rfid");
  const manualContainer = document.getElementById("container-input-manual");

  if (!scanContainer || !manualContainer) return;

  if (mode === "manual") {
    scanContainer.style.display = "none";
    manualContainer.style.display = "block";
    document.getElementById("manual-nama").focus();
  } else {
    manualContainer.style.display = "none";
    scanContainer.style.display = "block";
    setTimeout(() => {
      const inputRfid = document.getElementById("card-id-input");
      if (inputRfid) inputRfid.focus();
    }, 100);
  }
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
      resultEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ${data.message || "Kehadiran berhasil dicatat"}</div>`;

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
      resultEl.innerHTML = `<div class="alert alert-danger"><i class="bi bi-x-circle-fill"></i> ${data.error || data.message || "Gagal mencatat kehadiran"}</div>`;
    }
  } catch (error) {
    statusEl.innerHTML =
      '<span class="scan-status-badge error"><i class="bi bi-wifi-off"></i> Error</span>';
    resultEl.innerHTML =
      '<div class="alert alert-danger"><i class="bi bi-wifi-off"></i> Terjadi kesalahan koneksi ke server</div>';
  }

  document.getElementById("card-id-input").value = "";
  document.getElementById("card-id-input").focus();
}

async function submitManual() {
  const nama = document.getElementById("manual-nama").value.trim();
  const status = document.getElementById("manual-status").value;
  const keterangan = document.getElementById("manual-keterangan").value.trim();
  const resultManualEl = document.getElementById("manual-result");

  if (!nama) {
    alert("Nama siswa wajib diisi!");
    return;
  }

  resultManualEl.innerHTML =
    '<div class="alert alert-warning">Menyimpan data...</div>';

  try {
    const response = await fetch(
      "http://localhost:3000/api/attendances/manual",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-token": "12345",
        },
        body: JSON.stringify({
          username: nama,
          status: status,
          keterangan: keterangan,
        }),
      },
    );

    const data = await response.json();

    if (response.ok && data.success) {
      resultManualEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> Absensi manual ${nama} berhasil disimpan!</div>`;

      document.getElementById("manual-nama").value = "";
      document.getElementById("manual-keterangan").value = "";
      document.getElementById("manual-status").value = "Hadir";

      setTimeout(() => {
        resultManualEl.innerHTML = "";
        toggleAbsenMode("scan");
      }, 1500);
    } else {
      resultManualEl.innerHTML = `<div class="alert alert-danger">Gagal: ${data.error || data.message || "Terjadi kesalahan"}</div>`;
    }
  } catch (error) {
    resultManualEl.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>`;
  }
}
