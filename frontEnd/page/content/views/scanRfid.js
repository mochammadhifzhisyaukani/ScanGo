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
            <input type="text" id="manual-nama" class="form-control" placeholder="Ketik nama siswa..." list="daftar-siswa" style="width: 100%;">
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
            <datalist id="daftar-siswa"></datalist>
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

  loadDaftarSiswa();
  initManualNamaListener();
}

async function loadDaftarSiswa() {
  try {
    const res = await fetch("http://localhost:3000/api/users", {
      headers: { "api-token": "12345" },
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
    /* silently ignore */
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
    const res = await fetch("http://localhost:3000/api/users", {
      headers: { "api-token": "12345" },
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
    /* ignore */
  }
}

let lastCardId = null;

async function submitScan() {
  const cardId = document.getElementById("card-id-input").value.trim();
  if (!cardId) {
    showToast("Masukkan ID kartu RFID terlebih dahulu", "warning");
    return;
  }
  if (lastCardId === cardId) return;
  lastCardId = cardId;

  const statusEl = document.getElementById("scan-status");
  const resultEl = document.getElementById("scan-result");
  statusEl.innerHTML =
    '<span class="scan-status-badge scanning"><i class="bi bi-arrow-repeat"></i> Memproses...</span>';

  try {
    const resCheck = await fetch("http://localhost:3000/api/attendances", {
      headers: { "api-token": "12345" },
    });
    const jsonCheck = await resCheck.json();

    let dataHariIni = null;
    if (jsonCheck.success) {
      const todayStr = new Date().toLocaleDateString("sv-SE");

      const logHariIni = (jsonCheck.data || []).filter((row) => {
        const tglLog = row.created_at
          ? new Date(row.created_at).toLocaleDateString("sv-SE")
          : "";
        return row.idcard === cardId && tglLog === todayStr;
      });

      if (logHariIni.length > 0) {
        dataHariIni = logHariIni[0];
      }
    }

    let response;
    if (dataHariIni) {
      if (dataHariIni.time_finish || dataHariIni.status_keluar) {
        statusEl.innerHTML =
          '<span class="scan-status-badge error"><i class="bi bi-exclamation-octagon-fill"></i> Ditolak</span>';
        resultEl.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-octagon-fill"></i> Anda sudah absen masuk & keluar hari ini!</div>`;
        showToast("Kuota absen hari ini sudah habis", "warning");
        return;
      }

      const sekarangJam = new Date().toISOString();

      response = await fetch(
        `http://localhost:3000/api/attendances/${dataHariIni.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-token": "12345",
          },
          body: JSON.stringify({
            time_finish: sekarangJam,
          }),
        },
      );
    } else {
      response = await fetch(
        "http://localhost:3000/api/attendances/store?idcard=" +
          encodeURIComponent(cardId) +
          "&mac_address=RFID",
        {
          method: "POST",
          headers: { "api-token": "12345" },
        },
      );
    }

    const data = await response.json();

    if (response.ok && data.success) {
      statusEl.innerHTML =
        '<span class="scan-status-badge success"><i class="bi bi-check-circle-fill"></i> Berhasil!</span>';

      const pesanSukses = dataHariIni
        ? "Absen KELUAR berhasil dicatat!"
        : "Absen MASUK berhasil dicatat!";
      resultEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ${pesanSukses}</div>`;
      showToast(pesanSukses, "success");

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
      resultEl.innerHTML = `<div class="alert alert-danger"><i class="bi bi-x-circle-fill"></i> ${data.error || data.message || "Gagal memproses absensi"}</div>`;
    }
  } catch (error) {
    statusEl.innerHTML =
      '<span class="scan-status-badge error"><i class="bi bi-wifi-off"></i> Error</span>';
    resultEl.innerHTML =
      '<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>';
  } finally {
    document.getElementById("card-id-input").value = "";
    document.getElementById("card-id-input").focus();
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
  scanLock = true;

  resultManualEl.innerHTML =
    '<div class="alert alert-warning">Menyimpan data...</div>';

  try {
    const resCheck = await fetch("http://localhost:3000/api/attendances", {
      headers: { "api-token": "12345" },
    });
    const jsonCheck = await resCheck.json();

    let dataHariIni = null;
    if (jsonCheck.success) {
      const todayStr = new Date().toLocaleDateString("sv-SE");

      const logHariIni = (jsonCheck.data || []).filter((row) => {
        const tglLog = row.created_at
          ? new Date(row.created_at).toLocaleDateString("sv-SE")
          : "";
        const namaSiswaLog = row.users
          ? Array.isArray(row.users)
            ? row.users[0]?.username
            : row.users.username
          : null;

        return (
          namaSiswaLog &&
          namaSiswaLog.toLowerCase() === nama.toLowerCase() &&
          tglLog === todayStr
        );
      });

      if (logHariIni.length > 0) {
        dataHariIni = logHariIni[0];
      }
    }

    let response;
    if (dataHariIni) {
      if (dataHariIni.time_finish) {
        resultManualEl.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-octagon-fill"></i> Siswa ini sudah absen masuk & keluar hari ini!</div>`;
        showToast("Kuota absensi siswa ini sudah penuh", "warning");
        return;
      }

      const sekarangJam = new Date().toISOString();

      response = await fetch(
        `http://localhost:3000/api/attendances/${dataHariIni.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "api-token": "12345",
          },
          body: JSON.stringify({
            time_finish: sekarangJam,
          }),
        },
      );
    } else {
      response = await fetch("http://localhost:3000/api/attendances/manual", {
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
      });
    }

    const data = await response.json();

    if (response.ok && data.success) {
      const pesanSukses = dataHariIni
        ? `Absen keluar untuk ${nama} berhasil diupdate!`
        : `Absensi manual ${nama} berhasil disimpan!`;
      resultManualEl.innerHTML = `<div class="alert alert-success"><i class="bi bi-check-circle-fill"></i> ${data.message || pesanSukses}</div>`;

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
      resultManualEl.innerHTML = `<div class="alert alert-danger">Gagal: ${data.error || data.message || "Terjadi kesalahan"}</div>`;
      showToast(data.error || "Gagal memproses absensi", "danger");
    }
  } catch (error) {
    resultManualEl.innerHTML = `<div class="alert alert-danger">Terjadi kesalahan koneksi ke server</div>`;
    showToast("Koneksi ke server gagal", "danger");
  } finally {
    lastCardId = null;
  }
}
