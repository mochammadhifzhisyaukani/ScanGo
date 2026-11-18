function renderDashboard() {
  return `
  <!-- Tempat Stat Cards (Atas) -->
  <div id="top-stats-container"></div>
  
  <div class="dashboard-layout">
  <!-- panel kiri -->
    <aside class="left-panel">
      <div class="scan-rfid-container">

        <div class="scan-card" id="container-scan-rfid" style="margin: 0; padding: 30px 24px; max-width: 100%;">
          <div class="scan-icon-wrapper mt-2">
            <i class="bi bi-upc-scan"></i>
          </div>

          <div id="scan-status">
            <marquee class="scan-status-badge idle">
              <i class="bi bi-radio"></i> Menunggu scan kartu (Absen Masuk)...
            </marquee>
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

          <div id="scan-result" class="mt-3"></div>
        </div>

        <div class="scan-card" id="container-input-manual" style="display: none; margin: 0; padding: 30px 24px; max-width: 100%;">
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

      
    </aside>
  <!-- panel kanan-->
    <div class="right-panel" id="absensi-table-content">
    </div>
  </div>
  `;
}

if (typeof window.clockInterval === "undefined") window.clockInterval = null;
if (typeof window.currentSelectedClass === "undefined")
  window.currentSelectedClass = "X";
if (typeof window.currentSelectedRombel === "undefined")
  window.currentSelectedRombel = null;
if (typeof window.currentSelectedDate === "undefined")
  window.currentSelectedDate = new Date().toLocaleDateString("sv-SE");
if (typeof window.currentSelectedKelas === "undefined")
  window.currentSelectedKelas = "";
if (typeof window.currentSearchQuery === "undefined")
  window.currentSearchQuery = "";
if (typeof window.currentAttendancePage === "undefined")
  window.currentAttendancePage = 1;
const ATTENDANCE_PAGE_SIZE = 5;
if (typeof window.currentScanMode === "undefined")
  window.currentScanMode = "masuk";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// Daftar rombel disamakan dengan pilihan di inputStudent.js
const ROMBEL_GROUPS = [
  ["TEACHER", ["Guru Produktif"]],
  ["PPLG", ["PPLG 1", "PPLG 2", "PPLG 3", "PPLG 4", "PPLG 5"]],
  ["TJKT", ["TJKT 1", "TJKT 2", "TJKT 3", "TJKT 4", "TJKT 5"]],
  ["DKV", ["DKV 1", "DKV 2", "DKV 3", "DKV 4", "DKV 5"]],
  ["KLN", ["Kuliner 1", "Kuliner 2", "Kuliner 3", "Kuliner 4", "Kuliner 5"]],
  ["HTL", ["Hotel 1", "Hotel 2", "Hotel 3", "Hotel 4", "Hotel 5"]],
  ["PMN", ["Pemasaran 1", "Pemasaran 2", "Pemasaran 3", "Pemasaran 4", "Pemasaran 5"]],
];

function normRombel(value) {
  return String(value || "").trim().toUpperCase();
}

const KELAS_OPTIONS = ["X", "XI", "XII"];

function renderKelasOptions() {
  const selected = String(currentSelectedKelas || "");
  const allOption = `<option value=""${selected === "" ? " selected" : ""}>Semua Kelas</option>`;
  const kelasOptions = KELAS_OPTIONS.map(
    (k) =>
      `<option value="${k}"${normRombel(k) === normRombel(selected) ? " selected" : ""}>Kelas ${k}</option>`,
  ).join("");
  return allOption + kelasOptions;
}

function renderRombelOptions() {
  const selected = String(currentSelectedRombel || "");
  const allOption = `<option value=""${selected === "" ? " selected" : ""}>Semua Rombel</option>`;
  const groups = ROMBEL_GROUPS.map(([label, items]) => {
    const options = items
      .map(
        (val) =>
          `<option value="${val}"${normRombel(val) === normRombel(selected) ? " selected" : ""}>${val}</option>`,
      )
      .join("");
    return `<optgroup label="${label}">${options}</optgroup>`;
  }).join("");
  return allOption + groups;
}

function absenMasuk() {
  setScanMode("masuk");
}

function absenKeluar() {
  setScanMode("keluar");
}

function setScanMode(mode) {
  if (mode !== "masuk" && mode !== "keluar") mode = "masuk";
  window.currentScanMode = mode;

  const btnMasuk = document.getElementById("btn-absen-masuk");
  const btnKeluar = document.getElementById("btn-absen-keluar");

  if (btnMasuk && btnKeluar) {
    if (mode === "masuk") {
      btnMasuk.className = "btn btn-success w-100 btn-sm";
      btnKeluar.className = "btn btn-outline-danger w-100 btn-sm";
    } else {
      btnMasuk.className = "btn btn-outline-success w-100 btn-sm";
      btnKeluar.className = "btn btn-danger w-100 btn-sm";
    }
  }

  const label = mode === "masuk" ? "Absen Masuk" : "Absen Keluar";
  const statusEl = document.getElementById("scan-status");
  const input = document.getElementById("card-id-input");
  const resultEl = document.getElementById("scan-result");

  if (statusEl) {
    statusEl.innerHTML = `<marquee class="scan-status-badge idle"><i class="bi bi-radio"></i> Menunggu scan kartu (${label})...</marquee>`;
  }
  if (input) {
    input.placeholder =
      mode === "masuk"
        ? "Tempelkan kartu RFID (Absen Masuk)..."
        : "Tempelkan kartu RFID (Absen Keluar)...";
    input.value = "";
    input.focus();
  }
  if (resultEl) resultEl.innerHTML = "";
}

async function initDashboardListener() {
  const timeElement = document.getElementById("time");
  const dateElement = document.getElementById("date");

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  function updateClock() {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");
    let localDate = now.toLocaleDateString("id-ID", dateOptions);

    if (timeElement) timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    if (dateElement) dateElement.innerHTML = `${localDate}`;
  }

  if (typeof clockInterval !== "undefined" && clockInterval !== null) {
    clearInterval(clockInterval);
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  initTabs();
  if (typeof initScanRfid === "function") initScanRfid();
}

async function fetchAttendanceData() {
  try {
    const response = await fetch(`${API_BASE}/api/attendances`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      console.error(
        "Gagal mengambil data absensi. Status HTTP:",
        response.status,
      );
      return [];
    }

    const result = await response.json();
    return result.success ? result.data || [] : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getStatusClass(status) {
  switch ((status || "").toLowerCase()) {
    case "hadir":
      return "status-present";
    case "terlambat":
      return "status-late";
    case "sakit":
    case "izin":
      return "status-late";
    case "alfa":
    case "alpa":
      return "status-absent";
    default:
      return "status-present";
  }
}

function generateKontenKelasTemplate(namaKelas, dataAbsensi) {
  let dataFiltered = dataAbsensi.filter((row) => {
    if (!row.created_at) return false;

    const tanggalAbsen = new Date(row.created_at).toLocaleDateString("sv-SE");
    const cocokTanggal = tanggalAbsen === currentSelectedDate;
    if (!cocokTanggal) return false;

    if (currentSelectedKelas && currentSelectedKelas !== "all") {
      if (normRombel(row.kelas) !== normRombel(currentSelectedKelas)) {
        return false;
      }
    }

    if (currentSelectedRombel && currentSelectedRombel !== "all") {
      return normRombel(row.rombel) === normRombel(currentSelectedRombel);
    }

    return true;
  });

  const query = String(currentSearchQuery || "").trim().toLowerCase();
  if (query) {
    dataFiltered = dataFiltered.filter((row) => {
      const nama = row.users
        ? Array.isArray(row.users)
          ? row.users[0]?.username
          : row.users.username
        : "";
      const haystack = [
        nama,
        row.nis,
        row.idcard,
      ]
        .map((v) => String(v ?? "").toLowerCase())
        .join(" ");
      return haystack.includes(query);
    });
  }

  const totalHadir = dataFiltered.filter(
    (r) =>
      (r.status || "").toLowerCase() === "hadir" ||
      (r.status || "").toLowerCase() === "terlambat",
  ).length;
  // const totalSakit = dataFiltered.filter(
  //   (r) => (r.status || "").toLowerCase() === "sakit",
  // ).length;
  // const totalIzin = dataFiltered.filter(
  //   (r) => (r.status || "").toLowerCase() === "izin",
  // ).length;
  const totalAlpa = dataFiltered.filter(
    (r) =>
      (r.status || "").toLowerCase() === "alfa" ||
      (r.status || "").toLowerCase() === "alpa",
  ).length;
  const emptyMessage = (() => {
    if (String(currentSearchQuery || "").trim()) {
      return `Tidak ada hasil untuk pencarian "${currentSearchQuery.trim()}"`;
    }
    return currentSelectedRombel || currentSelectedKelas
      ? "Siswa belum absen"
      : "Belum ada riwayat tap kartu pada tanggal ini";
  })();

  const totalItems = dataFiltered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ATTENDANCE_PAGE_SIZE));
  if (currentAttendancePage > totalPages) currentAttendancePage = totalPages;
  if (currentAttendancePage < 1) currentAttendancePage = 1;
  const pageData = dataFiltered.slice(
    (currentAttendancePage - 1) * ATTENDANCE_PAGE_SIZE,
    currentAttendancePage * ATTENDANCE_PAGE_SIZE,
  );

  const tableRowsHtml =
    pageData.length === 0
      ?       `<tr><td colspan="9" class="text-center text-muted py-4">${emptyMessage}</td></tr>`
      : pageData
          .map((row) => {
            const jamAbsen = row.created_at
              ? new Date(row.created_at).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "-";

            const jamKeluar = row.time_finish
              ? new Date(row.time_finish).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "-";

            const namaSiswa = row.users
              ? Array.isArray(row.users)
                ? row.users[0]?.username
                : row.users.username
              : null;
            const displayNama = namaSiswa || row.idcard || "Tidak Dikenal";

            return `
                <tr>
                    <td class="text-muted d-none d-md-table-cell">${escapeHtml(row.id)}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-semibold" style="color: var(--color-teks);">${escapeHtml(displayNama)}</span>
                        </div>
                    </td>
                    <td class="text-muted">${escapeHtml(row.nis ?? "-")}</td>
                    <td class="text-muted">${escapeHtml(row.idcard || "-")}</td>
                    <td class="fw-semibold">${escapeHtml(row.rombel || "-")}</td>
                    <td class="fw-semibold">${jamAbsen || "-"}</td>
                    <td class="fw-semibold">${jamKeluar || "-"}</td>
                    <td class="text-muted">${escapeHtml(row.note || "-")}</td>
                    <td><span class="status-badge ${getStatusClass(row.status)}">${escapeHtml(row.status || "Hadir")}</span></td>
                </tr>
            `;
          })
          .join("");

  return {
    statsHtml: `
        <div class="row g-3 mb-3">
            <div class="col-12 col-md-2 col-lg-4">
                <div class="stat-card">
                    <div class="stat-label text-primary">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Total Siswa Hadir</span>
                    </div>
                    <div class="stat-value">${totalHadir}</div>
                    <div class="stat-indicator">
                        <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> Live</span>
                        <span class="text-muted ms-1" style="color: var(--color-teks) !important;">dari database</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="stat-card">
                    <div class="stat-label text-info">
                        <i class="bi bi-clock-history"></i>
                        <span>Total Siswa Terlambat</span>
                    </div>
                    <div class="stat-value">0</div>
                    <div class="stat-indicator">
                        <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> Live</span>
                        <span class="text-muted ms-1" style="color: var(--color-teks) !important;">dari database</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-4">
                <div class="stat-card">
                    <div class="stat-label text-danger">
                        <i class="bi bi-person-x-fill"></i>
                        <span>Total Siswa Tidak Hadir</span>
                    </div>
                    <div class="stat-value">${totalAlpa}</div>
                    <div class="stat-indicator">
                        <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> Live</span>
                        <span class="text-muted ms-1" style="color: var(--color-teks) !important;">dari database</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    tableHtml: `
        <div class="data-card" style="margin-top: 0;">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div class="d-flex align-items-center gap-2">
                    <h5 class="fw-bold m-0" style="color: var(--color-teks); font-size: 1.05rem;">Riwayat Absensi</h5>
                </div>
                <div class="d-flex gap-2 flex-wrap align-items-center">
                    <div class="d-flex align-items-center bg-light rounded-3 px-2 border-0" style="height: 34px;">
                        <i class="bi bi-search text-muted me-2" style="font-size: 0.85rem;"></i>
                        <input type="text" id="pencarianTabel" class="form-control form-control-sm bg-transparent border-0 text-muted p-0" placeholder="Cari nama / NIS / RFID..." style="font-size: 0.85rem; width: 160px; outline: none; box-shadow: none;" value="${escapeHtml(currentSearchQuery)}">
                    </div>
                    <select id="pilihanKelas" class="form-select form-select-sm bg-light border-0 text-muted rounded-3" style="width: auto; height: 34px; font-size: 0.85rem;">
                      ${renderKelasOptions()}
                    </select>
                    <select id="pilihanRombel" class="form-select form-select-sm bg-light border-0 text-muted rounded-3" style="width: auto; height: 34px; font-size: 0.85rem;">
                      ${renderRombelOptions()}
                    </select>
                    <div class="d-flex align-items-center bg-light rounded-3 px-2 border-0" style="height: 34px;">
                        <i class="bi bi-calendar3 text-muted me-2" style="font-size: 0.85rem;"></i>
                        <input type="date" id="filterTanggal" class="form-control form-control-sm bg-transparent border-0 text-muted p-0" style="font-size: 0.85rem; width: 120px; outline: none; box-shadow: none;" value="${currentSelectedDate}">
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle custom-table mb-0 w-100">
                    <thead>
                        <tr>
                            <th class="d-none d-md-table-cell" style="width: 8%;">ID Log</th>
                            <th style="width: 15%;">Nama Lengkap</th>
                            <th class="d-none d-md-table-cell" style="width: 10%;">NIS</th>
                            <th class="d-none d-md-table-cell" style="width: 13%;">Id RFID</th>
                            <th style="width: 13%;">Rombel</th>
                            <th style="width: 10%;">Absen Masuk</th>
                            <th style="width: 10%;">Absen Keluar</th>
                            <th style="width: 11%;">Keterangan</th>
                            <th style="width: 10%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
              <small class="text-muted">Halaman ${currentAttendancePage} dari ${totalPages} · Total ${totalItems} data</small>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item ${currentAttendancePage <= 1 ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="goToAttendancePage(${currentAttendancePage - 1}); return false;">Prev</a>
                  </li>
                  ${Array.from({ length: totalPages }, (_, i) => i + 1)
                    .map(
                      (p) =>
                        `<li class="page-item ${p === currentAttendancePage ? "active" : ""}">
                          <a class="page-link" href="#" onclick="goToAttendancePage(${p}); return false;">${p}</a>
                        </li>`,
                    )
                    .join("")}
                  <li class="page-item ${currentAttendancePage >= totalPages ? "disabled" : ""}">
                    <a class="page-link" href="#" onclick="goToAttendancePage(${currentAttendancePage + 1}); return false;">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
        </div>
    `,
  };
}

async function initTabs() {
  const tabs = document.querySelectorAll(".header-nav-tabs .nav-tab-item");
  const tableContainer = document.getElementById("absensi-table-content");
  const statsContainer = document.getElementById("top-stats-container");

  if (tableContainer && statsContainer) {
    tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memuat data absensi...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    const result = generateKontenKelasTemplate(
      currentSelectedClass,
      dataTerbaru,
    );
    statsContainer.innerHTML = result.statsHtml;
    tableContainer.innerHTML = result.tableHtml;
  }

  loadSiswaList();

  tabs.forEach((tab) => {
    tab.addEventListener("click", async function (e) {
      e.preventDefault();
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      currentSelectedClass = this.getAttribute("data-kelas");
      currentSelectedRombel = null;
      currentAttendancePage = 1;

      if (tableContainer && statsContainer) {
        tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memeriksa database...</p></div>`;
        const dataTerbaru = await fetchAttendanceData();
        const result = generateKontenKelasTemplate(
          currentSelectedClass,
          dataTerbaru,
        );
        statsContainer.innerHTML = result.statsHtml;
        tableContainer.innerHTML = result.tableHtml;
        attachFilters();
      }
    });
  });

  attachFilters();
}

function attachFilters() {
  const select = document.getElementById("pilihanRombel");
  if (select) {
    select.removeEventListener("change", handleRombelFilter);
    select.addEventListener("change", handleRombelFilter);
  }

  const kelasSelect = document.getElementById("pilihanKelas");
  if (kelasSelect) {
    kelasSelect.removeEventListener("change", handleKelasFilter);
    kelasSelect.addEventListener("change", handleKelasFilter);
  }

  const searchInput = document.getElementById("pencarianTabel");
  if (searchInput) {
    searchInput.removeEventListener("input", handleSearchInput);
    searchInput.addEventListener("input", handleSearchInput);
  }

  const dateInput = document.getElementById("filterTanggal");
  if (dateInput) {
    dateInput.removeEventListener("change", handleTanggalFilter);
    dateInput.addEventListener("change", handleTanggalFilter);
  }

  const cardInput = document.getElementById("card-id-input");
  if (cardInput) {
    cardInput.removeEventListener("keydown", handleCardInputKeydown);
    cardInput.addEventListener("keydown", handleCardInputKeydown);
    cardInput.removeEventListener("input", handleCardInputChange);
    cardInput.addEventListener("input", handleCardInputChange);
  }
}

function handleCardInputKeydown(e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitScan();
  }
}

let cardInputTimer = null;
function handleCardInputChange(e) {
  const val = (e.target.value || "").trim();
  if (val.length < 8) return;
  clearTimeout(cardInputTimer);
  cardInputTimer = setTimeout(() => {
    if ((document.getElementById("card-id-input")?.value || "").trim() === val) {
      submitScan();
    }
  }, 200);
}

let searchDebounceTimer = null;

function handleSearchInput(e) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    currentSearchQuery = e.target.value;
    currentAttendancePage = 1;
    refreshDashboardTable("Mencari data...", "pencarianTabel");
  }, 300);
}

function refreshDashboardTable(loadingText, focusId) {
  const tableContainer = document.getElementById("absensi-table-content");
  const statsContainer = document.getElementById("top-stats-container");

  if (tableContainer && statsContainer) {
    tableContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">${loadingText}</p></div>`;
    const dataTerbaru = fetchAttendanceData();
    dataTerbaru.then((data) => {
      const result = generateKontenKelasTemplate(
        currentSelectedClass,
        data,
      );
      statsContainer.innerHTML = result.statsHtml;
      tableContainer.innerHTML = result.tableHtml;
      attachFilters();

      if (focusId) {
        const focusEl = document.getElementById(focusId);
        if (focusEl) {
          focusEl.focus();
          const len = focusEl.value.length;
          try { focusEl.setSelectionRange(len, len); } catch (e) {}
        }
      }
    });
  }
}

async function handleKelasFilter() {
  const kelasSelect = document.getElementById("pilihanKelas");
  if (!kelasSelect) return;
  currentSelectedKelas = kelasSelect.value || "";
  currentAttendancePage = 1;
  refreshDashboardTable("Menyaring kelas...");
}

async function handleRombelFilter() {
  const selectElement = document.getElementById("pilihanRombel");
  if (!selectElement) return;
  const val = selectElement.value;
  currentSelectedRombel = val || null;
  currentAttendancePage = 1;
  refreshDashboardTable("Menyaring rombel...");
}

async function handleTanggalFilter() {
  const dateInputElement = document.getElementById("filterTanggal");
  if (!dateInputElement) return;

  currentSelectedDate = dateInputElement.value;
  currentAttendancePage = 1;
  refreshDashboardTable("Menyaring tanggal...");
}

function goToAttendancePage(page) {
  currentAttendancePage = page;
  refreshDashboardTable("Memuat halaman...");
}

function toggleAbsenMode(mode) {
  const scanCard = document.getElementById("container-scan-rfid");
  const manualCard = document.getElementById("container-input-manual");
  if (!scanCard || !manualCard) return;
  if (mode === "manual") {
    scanCard.style.display = "none";
    manualCard.style.display = "block";
  } else {
    manualCard.style.display = "none";
    scanCard.style.display = "block";
  }
}

async function loadSiswaList() {
  try {
    const res = await fetch(`${API_BASE}/api/users`);
    const json = await res.json();
    if (!json.success) return;
    const datalist = document.getElementById("daftar-siswa");
    if (!datalist) return;
    datalist.innerHTML = (json.data || [])
      .map((u) => `<option value="${escapeHtml(u.username)}"></option>`)
      .join("");
  } catch (e) {
    console.error(e);
  }
}

async function submitManual() {
  const nama = (document.getElementById("manual-nama")?.value || "").trim();
  const status = document.getElementById("manual-status")?.value || "Hadir";
  const note = (document.getElementById("manual-keterangan")?.value || "").trim();
  const resultEl = document.getElementById("manual-result");
  if (!nama) {
    if (resultEl) resultEl.innerHTML = `<div class="text-danger small">Nama siswa wajib diisi.</div>`;
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/attendances/manual`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: nama, status, note }),
    });
    const json = await res.json();
    if (resultEl) {
      resultEl.innerHTML = `<div class="${json.success ? "text-success" : "text-danger"} small">${escapeHtml(json.message || json.error || "Selesai")}</div>`;
    }
    if (json.success) {
      document.getElementById("manual-nama").value = "";
      document.getElementById("manual-keterangan").value = "";
      refreshDashboardTable("Memperbarui data...");
    }
  } catch (e) {
    if (resultEl) resultEl.innerHTML = `<div class="text-danger small">Gagal menyimpan.</div>`;
  }
}

async function submitScan() {
  const idcard = (document.getElementById("card-id-input")?.value || "").trim();
  const resultEl = document.getElementById("scan-result");
  if (!idcard) {
    if (resultEl) resultEl.innerHTML = `<div class="text-danger small">UID kartu wajib diisi.</div>`;
    return;
  }
  try {
    const res = await fetch(`${API_BASE}/api/attendances/tap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idcard, mode: currentScanMode || "masuk" }),
    });
    const json = await res.json();
    if (resultEl) {
      resultEl.innerHTML = `<div class="${json.success ? "text-success" : "text-danger"} small">${escapeHtml(json.message || "Selesai")}</div>`;
    }
    if (json.success) {
      const input = document.getElementById("card-id-input");
      if (input) input.value = "";
      refreshDashboardTable("Memperbarui data...");
    }
  } catch (e) {
    if (resultEl) resultEl.innerHTML = `<div class="text-danger small">Gagal menyimpan.</div>`;
  }
}

async function editAttendancesStatus(id, currentStatus) {
  const statusBaru = prompt(
    "Ubah status absensi (Hadir / Sakit / Izin / Alpa): ",
    currentStatus,
  );
  if (statusBaru === null) return;

  const statusValid = ["Hadir", "Sakit", "Izin", "Alpa"];
  if (!statusValid.includes(statusBaru.trim())) {
    alert("Status tidak valid! Masukkan: Hadir, Sakit, Izin, atau Alpa");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/attendances/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ status: statusBaru.trim() }),
    });

    const result = await response.json();
    if (response.ok && result.success) {
      alert("Status absensi berhasil diperbarui!");
      initTabs();
    } else {
      alert("Gagal memperbarui status: " + (result.message || "Error server"));
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi saat memperbarui data");
  }
}

async function deleteAttendanceLog(id) {
  if (!confirm("Apakah anda yakin ingin menghapus data log absensi ini?"))
    return;

  try {
    const response = await fetch(`${API_BASE}/api/attendances/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();
    if (response.ok && result.success) {
      alert("Log absensi berhasil dihapus!");
      initTabs();
    } else {
      alert("Gagal menghapus log: " + (result.message || "Error server"));
    }
  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan koneksi saat menghapus data");
  }
}
