function renderScanRfid() {
  return `
    <div class="scan-rfid-container">
      
      <div class="scan-card" id="container-scan-rfid">
        <div class="scan-header">
          <h3>Scan RFID</h3>
          <p>Pilih mode absen sebelum scan kartu</p>
          <div class="d-flex gap-2 justify-content-center mt-3">
            <button type="button" id="btn-absen-masuk" class="btn btn-success w-100 btn-sm" onclick="absenMasuk()">
              <i class="bi bi-box-arrow-in-right"></i> Masuk
            </button>
            <button type="button" id="btn-absen-keluar" class="btn btn-outline-danger w-100 btn-sm" onclick="absenKeluar()">
              <i class="bi bi-box-arrow-right"></i> Keluar
            </button>
          </div>
        </div>

        <div class="scan-icon-wrapper">
          <i class="bi bi-upc-scan"></i>
        </div>

        <div id="scan-status">
          <span class="scan-status-badge idle">
            <i class="bi bi-radio"></i> Menunggu scan kartu (Absen Masuk)...
          </span>
        </div>

        <div class="scan-input-group">
          <input
            type="text"
            id="card-id-input"
            class="form-control"
            placeholder="Tempelkan kartu RFID (Absen Masuk)..."
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
        <div class="scan-header" style="margin-bottom: 20px; border-bottom: 1px solid var(--border-form); padding-bottom: 10px;">
            <h3>Input Manual</h3>
            <p>Pilih nama dan isi keterangan absensi siswa</p>
        </div>

        <div class="scan-input-group" style="text-align: left; gap: 15px;">

            <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-teks); display: block; margin-bottom: 5px;">Nama Siswa</label>
                <input type="text" id="manual-nama" class="form-control" placeholder="Ketik nama siswa..." list="daftar-siswa" style="width: 100%;">
            </div>

            <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-teks); display: block; margin-bottom: 5px;">Status Kehadiran</label>
                <select id="manual-status" class="form-control" style="width: 100%; background-color: var(--color-card-bg); color: var(--color-teks);">
                    <option value="Hadir">Hadir</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Alfa">Alfa</option>
                </select>
            </div>

            <div>
                <label style="font-size: 0.85rem; font-weight: 600; color: var(--color-teks); display: block; margin-bottom: 5px;">Keterangan</label>
            <textarea id="manual-keterangan" class="form-control" rows="3" placeholder="Tulis alasan atau keterangan di sini..." style="width: 100%; height: auto; padding: 8px 12px;"></textarea>
            <datalist id="daftar-siswa"></datalist>
          </div>

            <button class="scan-btn" onclick="submitManual()">
              <i class="bi bi-check-circle"></i> Simpan Absen
            </button>

            <button class="inputManual-btn" onclick="toggleAbsenMode('scan')">
              Batal
            </button>

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

const scanBoundElements = new WeakSet();

function initScanRfid() {
  const input = document.getElementById("card-id-input");
  if (!input || scanBoundElements.has(input)) return;

  scanBoundElements.add(input);

  input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      submitScan();
    }
  });

  let autoSubmitTimer = null;
  input.addEventListener("input", function () {
    clearTimeout(autoSubmitTimer);
    autoSubmitTimer = setTimeout(() => {
      const val = this.value.trim();
      if (val.length >= 8) submitScan();
    }, 250);
  });

  setTimeout(() => input.focus(), 100);

  loadDaftarSiswa();
  initManualNamaListener();
}

async function loadDaftarSiswa() {
  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: "GET",
      credentials: "include"
    });
    const json = await res.json();
    if (!json.success) return;

    const datalist = document.getElementById("daftar-siswa");
    if (!datalist) return;

    datalist.innerHTML = "";
    (json.data || []).forEach((user) => {
      const opt = document.createElement("option");
      opt.value = user.username || user.name || "";
      datalist.appendChild(opt);
    });
  } catch (e) {

  }
}

function initManualNamaListener() {
  const inputNama = document.getElementById("manual-nama");
  if (!inputNama) return;

  let timer = null;
  inputNama.addEventListener("keyup", function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const nama = this.value.trim();
      const feedback = document.getElementById("nama-feedback");
      if (!nama) {
        if (feedback) feedback.remove();
        return;
      }
      cariNamaSiswa(nama);
    }, 400);
  });
}

async function cariNamaSiswa(nama) {
  let feedback = document.getElementById("nama-feedback");
  if (!feedback) {
    feedback = document.createElement("div");
    feedback.id = "nama-feedback";
    feedback.style.cssText = "font-size:0.8rem; margin-top:4px;";
    document.getElementById("manual-nama").parentNode.appendChild(feedback);
  }

  try {
    const res = await fetch(`${API_BASE}/api/users`, {
      method: "GET",
      credentials: "include"
    });
    const json = await res.json();
    if (!json.success) return;

    const found = (json.data || []).find(
      (u) => (u.username || "").toLowerCase() === nama.toLowerCase(),
    );

    if (found) {
      feedback.innerHTML = `<span style="color:#28a745;"><i class="bi bi-check-circle-fill"></i> Sesuai — RFID: ${found.idcard || "-"}</span>`;
    } else {
      feedback.innerHTML = `<span style="color:#dc3545;"><i class="bi bi-exclamation-circle-fill"></i> Nama tidak ditemukan di database</span>`;
    }
  } catch (e) {
  }
}

//text to speach untuk suara
function speakAbsensi(pesan) {
  if (!("speechSynthesis" in window)) {
    console.warn("Browser tidak mendukung Text-to-Speech");
    return;
  }

  window.speechSynthesis.cancel();

  const suara = new SpeechSynthesisUtterance(pesan);

  suara.lang = "id-ID";
  suara.rate = 0.9;
  suara.pitch = 1;
  suara.volume = 1;

  window.speechSynthesis.speak(suara);
}

let lastCardId = null;

async function submitScan() {
  const cardId = document.getElementById("card-id-input").value.trim();
  if (!cardId) {
    showToast("Masukkan ID kartu RFID terlebih dahulu", "warning");
    speakAbsensi("Masukkan ID kartu RFID terlebih dahulu");
    return;
  }
  if (lastCardId === cardId) return;
  lastCardId = cardId;

  const statusEl = document.getElementById("scan-status");
  const resultEl = document.getElementById("scan-result");
  statusEl.innerHTML =
    '<span class="scan-status-badge scanning"><i class="bi bi-arrow-repeat"></i> Memproses...</span>';

  const mode =
    (typeof window.currentScanMode !== "undefined" &&
      window.currentScanMode) ||
    "masuk";

  try {
    const response = await fetch(`${API_BASE}/api/attendances/tap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ idcard: cardId, mode }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      statusEl.innerHTML =
        '<span class="scan-status-badge success"><i class="bi bi-check-circle-fill"></i> Berhasil!</span>';

      const suksesKeluar = data.action === "keluar";
      const pesanSukses = suksesKeluar
        ? "Absen KELUAR berhasil dicatat!"
        : "Absen MASUK berhasil dicatat!";
      resultEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ${pesanSukses}</div>`;
      showToast(pesanSukses, "success");

      speakAbsensi(
        suksesKeluar
          ? "Absen keluar berhasil dicatat"
          : "Absen masuk berhasil dicatat"
      );

      setTimeout(() => {
        if (typeof navigateTo === "function") {
          navigateTo("dashboard");
        } else {
          window.location.href = "/frontEnd/page/structure/dashboard.html";
        }
      }, 2900);
      return;
    }

    let pesanError = data.error || data.message || "Gagal memproses absensi";
    let alertType = "danger";
    let ttsPesan = `Absensi gagal. ${pesanError}`;

    switch (data.code) {
      case "already_checked_in":
        alertType = "warning";
        pesanError = "Siswa ini sudah absen masuk hari ini. Gunakan mode <b>Keluar</b> untuk mencatat absen pulang.";
        ttsPesan = "Absensi gagal. Siswa sudah absen masuk hari ini. Gunakan mode Keluar untuk absen keluar.";
        break;
      case "already_finished":
        alertType = "warning";
        pesanError = "Siswa sudah absen masuk & keluar hari ini!";
        ttsPesan = "Absensi gagal. Siswa sudah melakukan absensi masuk dan keluar hari ini.";
        break;
      case "not_checked_in":
        alertType = "warning";
        pesanError = "Siswa ini belum absen masuk hari ini. Gunakan mode <b>Masuk</b> terlebih dahulu.";
        ttsPesan = "Absensi gagal. Siswa ini belum absen masuk hari ini. Gunakan mode Masuk terlebih dahulu.";
        break;
    }

    statusEl.innerHTML =
      '<span class="scan-status-badge error"><i class="bi bi-exclamation-octagon-fill"></i> Ditolak</span>';
    resultEl.innerHTML = `<div class="alert alert-${alertType} mt-3"><i class="bi bi-exclamation-octagon-fill"></i> ${pesanError}</div>`;
    speakAbsensi(ttsPesan);
  } catch (error) {
    statusEl.innerHTML =
      '<span class="scan-status-badge error"><i class="bi bi-wifi-off"></i> Error</span>';
    speakAbsensi("Absensi gagal. Terjadi kesalahan koneksi ke server");
    resultEl.innerHTML =
      '<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>';
    return;
  } finally {
    const inputEl = document.getElementById("card-id-input");
    if (inputEl) {
      inputEl.value = "";
      inputEl.focus();
    }
    if (lastCardId === cardId) lastCardId = null;
  }
}

async function submitManual() {
  if (lastCardId) return;
  const nama = document.getElementById("manual-nama").value.trim();
  const status = document.getElementById("manual-status").value;
  const keterangan = document.getElementById("manual-keterangan").value.trim();
  const resultManualEl = document.getElementById("manual-result");

  if (!nama) {
    showToast("Nama siswa wajib diisi!", "warning");
    document.getElementById("manual-nama").focus();
    return;
  }

  lastCardId = nama;

  resultManualEl.innerHTML =
    '<div class="alert alert-warning">Menyimpan data...</div>';

  const mode =
    (typeof window.currentScanMode !== "undefined" &&
      window.currentScanMode) ||
    "masuk";

  try {
    const response = await fetch(`${API_BASE}/api/attendances/tap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username: nama,
        mode,
        status,
        note: keterangan,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      const suksesKeluar = data.action === "keluar";
      const pesanSukses = suksesKeluar
        ? `Absen keluar untuk ${nama} berhasil diupdate!`
        : data.message || `Absensi manual ${nama} berhasil disimpan!`;
      resultManualEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ${pesanSukses}</div>`;

      document.getElementById("manual-nama").value = "";
      document.getElementById("manual-keterangan").value = "";
      document.getElementById("manual-status").value = "Hadir";

      const feedback = document.getElementById("nama-feedback");
      if (feedback) feedback.remove();

      showToast(pesanSukses, "success");

      setTimeout(() => {
        resultManualEl.innerHTML = "";
        toggleAbsenMode("scan");
      }, 1500);
    } else {
      let alertType = "danger";
      let pesanError = data.error || data.message || "Terjadi kesalahan";

      switch (data.code) {
        case "already_checked_in":
          alertType = "warning";
          pesanError = `${nama} sudah absen masuk hari ini. Gunakan mode <b>Keluar</b> untuk mencatat absen pulang.`;
          break;
        case "already_finished":
          alertType = "warning";
          pesanError = `${nama} sudah absen masuk & keluar hari ini!`;
          showToast("Kuota absensi siswa ini sudah penuh", "warning");
          break;
        case "not_checked_in":
          alertType = "warning";
          pesanError = `${nama} belum absen masuk hari ini. Gunakan mode <b>Masuk</b> terlebih dahulu.`;
          break;
        case "user_not_found":
          alertType = "warning";
          break;
      }

      resultManualEl.innerHTML = `<div class="alert alert-${alertType}"><i class="bi bi-exclamation-octagon-fill"></i> ${pesanError}</div>`;
    }
  } catch (error) {
    resultManualEl.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>`;
    showToast("Koneksi ke server gagal", "danger");
  } finally {
    if (lastCardId === nama) lastCardId = null;
  }
}
