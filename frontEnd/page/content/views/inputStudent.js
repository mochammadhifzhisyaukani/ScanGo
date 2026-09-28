if (typeof window.tableAllData === "undefined") window.tableAllData = [];
if (typeof window.tableSortKey === "undefined") window.tableSortKey = "nama";
if (typeof window.tableSortDir === "undefined") window.tableSortDir = "asc";
if (typeof window.tableSearchQuery === "undefined")
  window.tableSearchQuery = "";
if (typeof window.tableRoleFilter === "undefined")
  window.tableRoleFilter = null;

function renderInputSiswa() {
  window.tableRoleFilter = null;
  return renderFormSiswaHTML() + renderDataTableHTML("Daftar Siswa / Guru");
}

function renderDataSiswa() {
  window.tableRoleFilter = "student";
  return renderFormSiswaHTML() + renderDataTableHTML("Data Siswa");
}

function renderDataGuru() {
  window.tableRoleFilter = "teacher";
  return renderFormGuruHTML() + renderDataTableHTML("Data Guru");
}

function initDataTableListener() {
  initInputSiswaListener();
}

function getFormContainerEl() {
  return (
    document.getElementById("formInputContainer") ||
    document.getElementById("formInputContainerGuru")
  );
}

function renderFormSiswaHTML() {
  return `
  <div id="formInputContainer" class="form-input-container" style="display: none;">

    <div class="back-link" id="btnBackToData">
      <i class="bi bi-arrow-left"></i> Kembali
    </div>

    <h2 class="form-title">
      Input Siswa Baru
    </h2>

    <form class="form-grid" id="formInputSiswa" data-mode="siswa" autocomplete="off">

      <div class="form-group">
        <label class="form-label" for="nis">
          <i class="bi bi-person-vcard"></i> NIS / NIP
        </label>
        <input type="number" id="nis" class="form-control-modern" placeholder="Nomor Induk Siswa / NIP Guru" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="call">
          <i class="bi bi-whatsapp"></i> No Whatsapp Orang Tua/Siswa
        </label>
        <input type="number" id="whatsapp" class="form-control-modern" value="62" required >
      </div>

      <div class="form-group rfid-field">
        <label class="form-label" for="RFID">
          <i class="bi bi-rss"></i> UID RFID
        </label>
        <input type="number" id="RFID" class="form-control-modern" placeholder="Tempelkan kartu ke reader atau ketik manual" required>
        <span class="form-hint">
          <i class="bi bi-info-circle"></i> Tempelkan kartu RFID ke reader saat kursor di sini &mdash; UID terisi otomatis.
        </span>
      </div>

      <div class="form-group">
        <label class="form-label" for="username">
          <i class="bi bi-person"></i> Nama Lengkap
        </label>
        <input type="text" id="username" class="form-control-modern" placeholder="Nama Lengkap" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="email">
          <i class="bi bi-envelope"></i> Email
        </label>
        <input type="email" id="email" class="form-control-modern" placeholder="example@smkwikrama.sch.id" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">
          <i class="bi bi-lock"></i> Password
        </label>
        <input type="password" id="password" class="form-control-modern" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="kelas">
          <i class="bi bi-people"></i> Kelas
        </label>
        <select id="kelas" class="form-control-modern">
          <option value="">Pilih Kelas</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="rombel">
          <i class="bi bi-people"></i> Rombel
        </label>
        <select id="rombel" class="form-control-modern">
          <option value="">Pilih Rombel</option>
          <optgroup label="PPLG">
            <option value="PPLG 1">PPLG 1</option>
            <option value="PPLG 2">PPLG 2</option>
            <option value="PPLG 3">PPLG 3</option>
            <option value="PPLG 4">PPLG 4</option>
            <option value="PPLG 5">PPLG 5</option>
          </optgroup>
          <optgroup label="TJKT">
            <option value="TJKT 1">TJKT 1</option>
            <option value="TJKT 2">TJKT 2</option>
            <option value="TJKT 3">TJKT 3</option>
            <option value="TJKT 4">TJKT 4</option>
            <option value="TJKT 5">TJKT 5</option>
          </optgroup>
          <optgroup label="DKV">
            <option value="DKV 1">DKV 1</option>
            <option value="DKV 2">DKV 2</option>
            <option value="DKV 3">DKV 3</option>
            <option value="DKV 4">DKV 4</option>
            <option value="DKV 5">DKV 5</option>
          </optgroup>
          <optgroup label="KLN">
            <option value="Kuliner 1">Kuliner 1</option>
            <option value="Kuliner 2">Kuliner 2</option>
            <option value="Kuliner 3">Kuliner 3</option>
            <option value="Kuliner 4">Kuliner 4</option>
            <option value="Kuliner 5">Kuliner 5</option>
          </optgroup>
          <optgroup label="HTL">
            <option value="Hotel 1">Hotel 1</option>
            <option value="Hotel 2">Hotel 2</option>
            <option value="Hotel 3">Hotel 3</option>
            <option value="Hotel 4">Hotel 4</option>
            <option value="Hotel 5">Hotel 5</option>
          </optgroup>
          <optgroup label="PMN">
            <option value="Pemasaran 1">Pemasaran 1</option>
            <option value="Pemasaran 2">Pemasaran 2</option>
            <option value="Pemasaran 3">Pemasaran 3</option>
            <option value="Pemasaran 4">Pemasaran 4</option>
            <option value="Pemasaran 5">Pemasaran 5</option>
          </optgroup>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label" for="rayon">
          <i class="bi bi-people"></i> Rayon
        </label>
        <select id="rayon" class="form-control-modern">
          <option value="">Pilih Rayon</option>
          <optgroup label="Cicurug">
            <option value="cic1">Cicurug 1</option>
            <option value="cic2">Cicurug 2</option>
            <option value="cic3">Cicurug 3</option>
            <option value="cic4">Cicurug 4</option>
            <option value="cic5">Cicurug 5</option>
            <option value="cic6">Cicurug 6</option>
            <option value="cic7">Cicurug 7</option>
            <option value="cic8">Cicurug 8</option>
            <option value="cic9">Cicurug 9</option>
            <option value="cic10">Cicurug 10</option>
          </optgroup>
          <optgroup label="Cisarua">
            <option value="cis1">Cisarua 1</option>
            <option value="cis2">Cisarua 2</option>
            <option value="cis3">Cisarua 3</option>
            <option value="cis4">Cisarua 4</option>
            <option value="cis5">Cisarua 5</option>
            <option value="cis6">Cisarua 6</option>
            <option value="cis7">Cisarua 7</option>
          </optgroup>
          <optgroup label="Cibedug">
            <option value="cib1">Cibedug 1</option>
            <option value="cib2">Cibedug 2</option>
          </optgroup>
          <optgroup label="Sukasari">
            <option value="suk1">Sukasari 1</option>
            <option value="suk2">Sukasari 2</option>
          </optgroup>
          <optgroup label="Ciawi">
            <option value="cia1">Ciawi 1</option>
            <option value="cia2">Ciawi 2</option>
            <option value="cia3">Ciawi 3</option>
            <option value="cia4">Ciawi 4</option>
            <option value="cia5">Ciawi 5</option>
            <option value="cia6">Ciawi 6</option>
          </optgroup>
          <optgroup label="Tajur">
            <option value="taj1">Tajur 1</option>
            <option value="taj2">Tajur 2</option>
            <option value="taj3">Tajur 3</option>
            <option value="taj4">Tajur 4</option>
            <option value="taj5">Tajur 5</option>
            <option value="taj6">Tajur 6</option>
          </optgroup>
          <optgroup label="Wikrama">
            <option value="wik1">Wikrama 1</option>
            <option value="wik2">Wikrama 2</option>
            <option value="wik3">Wikrama 3</option>
            <option value="wik4">Wikrama 4</option>
            <option value="wik5">Wikrama 5</option>
          </optgroup>
        </select>
      </div>

      <div class="form-actions">
        <button type="button" class="btn-cancel" id="btnBackToDataAlt">
          <i class="bi bi-x-lg"></i> Batal
        </button>
        <button type="button" id="btnSave" class="btn-save">
          <i class="bi bi-check-lg"></i> Simpan
        </button>
      </div>

    </form>
  </div>
`;
}

function renderFormGuruHTML() {
  return `
  <div id="formInputContainerGuru" class="form-input-container form-input-container-guru" style="display: none;">

    <div class="back-link" id="btnBackToData">
      <i class="bi bi-arrow-left"></i> Kembali
    </div>

    <h2 class="form-title">
      Input Data Guru/Laboran
    </h2>

    <form class="form-grid" id="formInputGuru" data-mode="guru" autocomplete="off">

      <div class="form-group">
        <label class="form-label" for="nis">
          <i class="bi bi-person-vcard"></i> NIP
        </label>
        <input type="number" id="nis" class="form-control-modern" placeholder="Nomor Induk Pegawai" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="call">
          <i class="bi bi-whatsapp"></i> No Whatsapp Guru
        </label>
        <input type="number" id="whatsapp" class="form-control-modern" value="62" required>
      </div>

      <div class="form-group rfid-field">
        <label class="form-label" for="RFID">
          <i class="bi bi-rss"></i> UID RFID
        </label>
        <input type="number" id="RFID" class="form-control-modern" placeholder="Tempelkan kartu ke reader atau ketik manual" required>
        <span class="form-hint">
          <i class="bi bi-info-circle"></i> Tempelkan kartu RFID ke reader saat kursor di sini &mdash; UID terisi otomatis.
        </span>
      </div>

      <div class="form-group">
        <label class="form-label" for="username">
          <i class="bi bi-person"></i> Nama Lengkap
        </label>
        <input type="text" id="username" class="form-control-modern" placeholder="Nama Lengkap" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="email">
          <i class="bi bi-envelope"></i> Email
        </label>
        <input type="email" id="email" class="form-control-modern" placeholder="example@smkwikrama.sch.id" required>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">
          <i class="bi bi-lock"></i> Password
        </label>
        <input type="password" id="password" class="form-control-modern" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" required>
      </div>

      <input type="hidden" id="rombel" value="Guru Produktif">
      <input type="hidden" id="rayon" value="Guru Produktif">

      <div class="form-actions">
        <button type="button" class="btn-cancel" id="btnBackToDataAlt">
          <i class="bi bi-x-lg"></i> Batal
        </button>
        <button type="button" id="btnSave" class="btn-save">
          <i class="bi bi-check-lg"></i> Simpan
        </button>
      </div>

    </form>
  </div>
`;
}

function renderDataTableHTML(tableTitle) {
  return `
  <div id="dataContainer" class="data-container">
    <div class="data-card">
      <div class="table-header">
        <h5 class="table-title">
          ${tableTitle}
        </h5>
        <div class="table-actions">
          <input type="text" id="searchTable" class="form-control form-control-sm bg-light border-0 text-muted rounded-3" style="width: 220px; height: 34px; font-size: 0.85rem;" placeholder="Cari nama / NIS / RFID...">
          <input type="file" id="excelInput" accept=".xlsx, .xls, .csv" style="display: none;">
          <button type="button" id="btnImportManual" class="btn-import btn-import-manual">
            <i class="bi bi-pencil-square"></i> Input Manual
          </button>
          <button type="button" id="btnImportExcel" class="btn-import btn-import-excel">
            <i class="bi bi-file-earmark-spreadsheet"></i> Import Excel
          </button>
        </div>
      </div>
      <div class="table-wrapper">
        <table class="table-custom">
          <thead>
            <tr>
              <th>#</th>
              <th data-sort="nama" class="sortable-th">Nama <span class="sort-indicator"></span></th>
              <th data-sort="rombel" class="sortable-th">Rombel <span class="sort-indicator"></span></th>
              <th data-sort="idcard" class="sortable-th">UID RFID <span class="sort-indicator"></span></th>
              <th>Status</th>
              <th>No Whatsapp</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody id="tableSiswaBody"></tbody>
        </table>
      </div>
    </div>
  </div>
`;
}

function initInputSiswaListener() {
  loadTableSiswa();
  initImportExcelListener();
  initImportManualListener();
  attachTableListeners();

  const btnDaftar = document.querySelector(".btn-save");
  if (!btnDaftar) return;

  btnDaftar.addEventListener("click", async function (e) {
    e.preventDefault();

    const formEl =
      document.getElementById("formInputSiswa") ||
      document.getElementById("formInputGuru");
    const mode = formEl?.dataset?.mode === "guru" ? "guru" : "siswa";

    const IdRfidInput = document.getElementById("RFID");
    const nisInput = document.getElementById("nis");
    const rombelInput = document.getElementById("rombel");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const whatsappInput = document.getElementById("whatsapp");
    const rayonInput = document.getElementById("rayon");
    const kelasInput = document.getElementById("kelas");

    if (
      !IdRfidInput ||
      !nisInput ||
      !rombelInput ||
      !usernameInput ||
      !emailInput ||
      !passwordInput ||
      !whatsappInput ||
      !rayonInput
    ) {
      console.error("Ada elemen HTML yang gagal dimuat!");
      return;
    }

    const idcard = IdRfidInput.value.trim();
    const nis = nisInput.value.trim();
    const rombel = rombelInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = mode === "guru" ? "teacher" : "student";
    const whatsapp = whatsappInput.value.trim();
    const rayon = rayonInput.value.trim();
    const kelas = mode === "guru" ? null : kelasInput?.value.trim() || "";

    if (
      !username ||
      !email ||
      !password ||
      !rombel ||
      !idcard ||
      !nis ||
      !role ||
      !whatsapp ||
      !rayon ||
      (mode !== "guru" && !kelas)
    ) {
      showToast("Wajib mengisi semua kolom input!", "danger");
      Swal.fire({
        title: "Register Error",
        text: "Semua form wajib diisi dengan lengkap!",
        icon: "error",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
      return;
    }

    if (!whatsapp.startsWith("62")) {
      showToast("Nomor WhatsApp harus diawali 62", "warning");
      Swal.fire({
        title: "Format WhatsApp Salah",
        text: "Nomor WhatsApp harus diawali dengan 62",
        icon: "warning",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },
        buttonsStyling: false,
      });
      whatsappInput.focus();
      return;
    }

    try {
      btnDaftar.disabled = true;
      btnDaftar.innerText = "Memproses...";

      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          idcard,
          rombel,
          nis,
          whatsapp,
          rayon,
          kelas,
        }),
      });

      if (!response.ok) {
        const errResult = await response.json().catch(() => ({}));
        showToast("Terjadi kesalahan saat mendaftar", "danger");
        Swal.fire({
          title: "Registrasi Gagal!",
          text: errResult.message || "Gagal menyimpan ke database Supabase",
          icon: "error",
          customClass: {
            popup: "sweetalert-popup",
            confirmButton: "sweetalert-btn-error",
          },
          buttonsStyling: false,
        });
        return;
      }

      const result = await response.json();

      showToast("Akun baru berhasil ditambahkan!", "success");
      Swal.fire({
        title: "Registrasi Berhasil!",
        icon: "success",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },
        buttonsStyling: false,
      });

      usernameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      rombelInput.value = mode === "guru" ? "Guru Produktif" : "";
      nisInput.value = "";
      IdRfidInput.value = "";
      whatsappInput.value = "";
      rayonInput.value = mode === "guru" ? "Guru Produktif" : "";
      if (kelasInput) kelasInput.value = "";

      getFormContainerEl().style.display = "none";
      document.getElementById("dataContainer").style.display = "block";
      loadTableSiswa();
    } catch (error) {
      showToast("Gagal terhubung ke server backend", "danger");
      console.error("Error Register: ", error);
      Swal.fire({
        title: "Registrasi Error",
        text: "Koneksi ke API Localhost terputus!",
        icon: "error",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
    } finally {
      btnDaftar.disabled = false;
      btnDaftar.innerText = "Simpan";
    }
  });
}

async function loadTableSiswa() {
  const tableBody = document.querySelector("#tableSiswaBody");
  if (!tableBody) return;

  try {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Memuat data...</td></tr>`;

    const response = await fetch(`${API_BASE}/api/users`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errResult = await response.json().catch(() => ({}));
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Gagal memuat data siswa: ${errResult.message || response.statusText}</td></tr>`;
      return;
    }

    const result = await response.json();

    if (!result.success) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Gagal memuat data siswa!</td></tr>`;
      return;
    }

    if (result.data.length === 0) {
      window.tableAllData = [];
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Belum ada data siswa terdaftar.</td></tr>`;
      return;
    }

    window.tableAllData = result.data;
    renderTable();
    attachRombelFilterInput();
  } catch (error) {
    console.error("Error loading table: ", error);
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Koneksi ke server terputus!</td></tr>`;
  }
}

function renderTable() {
  const tableBody = document.querySelector("#tableSiswaBody");
  if (!tableBody) return;

  let rows = (window.tableAllData || []).slice();

  if (currentSelectedRombel) {
    rows = rows.filter((u) => String(u.rombel || "") === currentSelectedRombel);
  }

  if (window.tableRoleFilter) {
    rows = rows.filter((u) => String(u.role || "") === window.tableRoleFilter);
  }

  if (tableSearchQuery) {
    const q = tableSearchQuery.toLowerCase();
    rows = rows.filter((u) =>
      [
        u.username,
        u.nis,
        u.idcard,
        u.rombel,
        u.whatsapp,
        u.role === "teacher" ? "Guru" : "Siswa",
        u.rayon,
        u.kelas,
      ].some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }

  rows.sort((a, b) => {
    const va = getSortValue(a);
    const vb = getSortValue(b);
    let cmp;
    if (tableSortKey === "idcard") {
      cmp = (parseInt(va, 10) || 0) - (parseInt(vb, 10) || 0);
    } else {
      cmp = String(va).localeCompare(String(vb), "id", { sensitivity: "base" });
    }
    return tableSortDir === "asc" ? cmp : -cmp;
  });

  tableBody.innerHTML = "";

  if (rows.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:24px; color:var(--color-teks-sub);">Tidak ada data yang cocok.</td></tr>`;
    updateSortIndicator();
    return;
  }

  rows.forEach((user, index) => {
    const userEmail = user.email || user.Email || "";
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <strong>${user.username}</strong><br>
          <small style="color:var(--color-teks-sub);">${user.nis}</small>
          <small style="color:var(--color-teks-sub);">${user.rayon}</small> 
          <span class="badge-${user.role === "teacher" ? "guru" : "siswa"}">${user.role === "teacher" ? "Guru" : "Siswa"}</span>
        </td>
        <td>${user.kelas || ""} ${user.rombel || "-"}</td>
        <td><code>${user.idcard}</code></td>
        <td><span class="status-aktif">Aktif</span></td>
        <td>${user.whatsapp}</td>
        <td>
          <button class= "btn-detail btn btn-secondary btn-sm" data-id="${user.id}" data-nis="${user.nis}" data-email="${userEmail}"><i class="bi bi-eye"></i></button>
          <button class="btn-edit btn btn-primary btn-sm" data-id="${user.id}" data-nis="${user.nis}" data-email="${userEmail}"><i class="bi bi-pencil-square"></i></button>
          <button class="btn-delete btn btn-danger btn-sm" data-id="${user.id}" data-nis="${user.nis}"><i class="bi bi-trash"></i></button>
        </td>
      `;
    tableBody.appendChild(row);
  });

  initActionButtonsListener();
  updateSortIndicator();
}

function getSortValue(user) {
  switch (tableSortKey) {
    case "nama":
      return String(user.username || "").toLowerCase();
    case "rombel":
      return String(user.rombel || "");
    case "idcard":
      return String(user.idcard || "");
    case "rayon":
      return String(user.rayon || "");
    case "kelas":
      return String(user.kelas || "");
    default:
      return "";
  }
}

function attachTableListeners() {
  const searchInput = document.getElementById("searchTable");
  if (searchInput) {
    searchInput.removeEventListener("input", handleTableSearchInput);
    searchInput.addEventListener("input", handleTableSearchInput);
  }

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.removeEventListener("click", handleTableSortClick);
    th.addEventListener("click", handleTableSortClick);
  });
}

function handleTableSearchInput(e) {
  tableSearchQuery = e.target.value.trim();
  renderTable();
}

function handleTableSortClick(e) {
  const key = e.currentTarget.getAttribute("data-sort");
  if (tableSortKey === key) {
    tableSortDir = tableSortDir === "asc" ? "desc" : "asc";
  } else {
    tableSortKey = key;
    tableSortDir = "asc";
  }
  renderTable();
}

function updateSortIndicator() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    const indicator = th.querySelector(".sort-indicator");
    if (!indicator) return;
    const key = th.getAttribute("data-sort");
    if (key === tableSortKey) {
      indicator.textContent = tableSortDir === "asc" ? "\u25B2" : "\u25BC";
      indicator.style.color = "var(--color-primary, #1d4ed8)";
    } else {
      indicator.textContent = "";
    }
  });
}

function showToast(message, type = "success") {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  Toast.fire({
    icon: type === "danger" ? "error" : type,
    title: message,
  });
}

function initImportExcelListener() {
  const btnImport = document.getElementById("btnImportExcel");
  const excelInput = document.getElementById("excelInput");

  if (!btnImport || !excelInput) return;

  btnImport.addEventListener("click", () => {
    excelInput.click();
  });

  excelInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Swal.fire({
      title: "Memproses File...",
      text: "Mohon Menunggu Sesaat.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
          throw new Error("File excel kosong atau format tidak sesuai!");
        }

        const response = await fetch(`${API_BASE}/api/auth/register-bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ users: jsonData }),
        });

        if (!response.ok) {
          const errResult = await response.json().catch(() => ({}));
          throw new Error(errResult.message || "Gagal Menyimpan Massal!");
        }

        const result = await response.json();

        Swal.fire({
          title: "Sukses!",
          text: `${jsonData.length} Data siswa berhasil diimport dari Excel!`,
          icon: "success",
        });

        loadTableSiswa();
      } catch (error) {
        Swal.fire({
          title: "Import Gagal!",
          text: error.message,
          icon: "error",
        });
      } finally {
        excelInput.value = "";
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function initImportManualListener() {
  const btnManual = document.getElementById("btnImportManual");
  const btnBack = document.getElementById("btnBackToData");
  const btnBackAlt = document.getElementById("btnBackToDataAlt");
  if (!btnManual) return;

  function showForm() {
    document.getElementById("dataContainer").style.display = "none";
    getFormContainerEl().style.display = "block";
  }

  function showData() {
    getFormContainerEl().style.display = "none";
    document.getElementById("dataContainer").style.display = "block";
  }

  btnManual.addEventListener("click", showForm);

  if (btnBack) {
    btnBack.addEventListener("click", showData);
  }

  if (btnBackAlt) {
    btnBackAlt.addEventListener("click", showData);
  }
}

function initActionButtonsListener() {
  const tableBody = document.querySelector("#tableSiswaBody");
  if (!tableBody) return;

  tableBody.onclick = async (e) => {
    if (
      e.target.classList.contains("btn-delete") ||
      e.target.closest(".btn-delete")
    ) {
      // delete
      const button = e.target.classList.contains("btn-delete")
        ? e.target
        : e.target.closest(".btn-delete");
      const nis = button.getAttribute("data-nis");
      const id = button.getAttribute("data-id");
      if (!id) return showToast("ID data tidak ditemukan!", "danger");

      const confirm = await Swal.fire({
        title: "Yakin mau dihapus?",
        text: `Data ${nis} akan hilang permanen dari database.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (!confirm.isConfirmed) return;

      try {
        const response = await fetch(`${API_BASE}/api/users/id/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const errResult = await response.json().catch(() => ({}));
          throw new Error(errResult.message || "Gagal menghapus data");
        }

        const result = await response.json();

        showToast("Data berhasil dihapus!", "success");
        loadTableSiswa();
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error");
      }
    }
    //edit
    if (
      e.target.classList.contains("btn-edit") ||
      e.target.closest(".btn-edit")
    ) {
      const button = e.target.classList.contains("btn-edit")
        ? e.target
        : e.target.closest(".btn-edit");
      const id = button.getAttribute("data-id");
      const email = button.getAttribute("data-email");
      if (!id) return showToast("ID data tidak ditemukan!", "danger");
      actionEditSiswa(id, email);
    }
    //detail
    if (
      e.target.classList.contains("btn-detail") ||
      e.target.closest(".btn-detail")
    ) {
      const button = e.target.classList.contains("btn-detail")
        ? e.target
        : e.target.closest(".btn-detail");
      const nis = button.getAttribute("data-nis");

      routerState = {
        nis: nis,
      };

      navigateTo("detail-siswa");
    }
  };
}

async function actionEditSiswa(id, email) {
  try {
    const row = document
      .querySelector(`button[data-id="${id}"]`)
      .closest("tr");
    if (!row) return Swal.fire("Eror", "Baris data tidak ditemukan!", "error");

    const userData = (window.tableAllData || []).find(
      (u) => String(u.id) === String(id),
    );
    if (!userData)
      return Swal.fire("Eror", "Data pengguna tidak ditemukan!", "error");

    const isTeacher = String(userData.role || "").toLowerCase() === "teacher";

    const nis = userData?.nis || "";
    const username = userData?.username || "";
    const emailUser = userData?.email || email;
    const idcard = userData?.idcard || "";
    const whatsapp = userData?.whatsapp || "";
    const role = userData?.role || "student";
    const rombel = userData?.rombel || "";
    const kelasDb = userData?.kelas || "";
    const rayonDb = userData?.rayon || "";

    const escapeAttr = (value) =>
      String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");

    function normalRayonEdit(v) {
      const map = {
        cic: "Cicurug",
        cis: "Cisarua",
        cib: "Cibedug",
        suk: "Sukasari",
        cia: "Ciawi",
        taj: "Tajur",
        wik: "Wikrama",
      };
      const m = String(v || "")
        .trim()
        .match(/^([a-zA-Z]+)(\d+)$/);
      if (!m) return v;
      return map[m[1].toLowerCase()]
        ? `${map[m[1].toLowerCase()]} ${parseInt(m[2], 10)}`
        : v;
    }

    const identitasHTML = `
        <div style="text-align: left; margin-bottom: 8px;">
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>NIS / NIP</label></div>
        <input id="swal-nis" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;" value="${escapeAttr(nis)}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>Nama Lengkap</label></div>
        <input id="swal-username" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;" value="${escapeAttr(username)}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>Email</label></div>
        <input id="swal-email" class="swal2-input" style="margin-top:0;" value="${escapeAttr(emailUser)}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>UID RFID</label></div>
        <input id="swal-idcard" class="swal2-input" style="margin-top:0;" value="${escapeAttr(idcard)}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>${isTeacher ? "No Whatsapp" : "No Whatsapp"}</label></div>
        <input id="swal-whatsapp" class="swal2-input" style="margin-top:0;" value="${escapeAttr(whatsapp)}">
      `;

    const roleSiswaHTML = `
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>Peran</label></div>
        <select id="swal-role" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;">
          <option value="student" ${role === "student" ? "selected" : ""}>Siswa</option>
          <option value="teacher" ${role === "teacher" ? "selected" : ""}>Guru</option>
        </select>
      `;

    const opsiKelasHTML = `
      <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Kelas</label></div>
        <div class="form-group">
        <select id="swal-kelas" class="form-control-modern">
          <option value="">Pilih Kelas</option>
          <option value="X">Kelas X</option>
          <option value="XI">Kelas XI</option>
          <option value="XII">Kelas XII</option>
        </select>
      </div>
      `;

    const opsiRombelSiswaHTML = `
      <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Rombel</label></div>
      <div class="form-group">
        <select id="swal-rombel" class="form-control-modern">
          <option value="">Pilih Rombel</option>
          <optgroup label="PPLG">
            <option value="PPLG 1">PPLG 1</option>
            <option value="PPLG 2">PPLG 2</option>
            <option value="PPLG 3">PPLG 3</option>
            <option value="PPLG 4">PPLG 4</option>
            <option value="PPLG 5">PPLG 5</option>
          </optgroup>
          <optgroup label="TJKT">
            <option value="TJKT 1">TJKT 1</option>
            <option value="TJKT 2">TJKT 2</option>
            <option value="TJKT 3">TJKT 3</option>
            <option value="TJKT 4">TJKT 4</option>
            <option value="TJKT 5">TJKT 5</option>
          </optgroup>
          <optgroup label="DKV">
            <option value="DKV 1">DKV 1</option>
            <option value="DKV 2">DKV 2</option>
            <option value="DKV 3">DKV 3</option>
            <option value="DKV 4">DKV 4</option>
            <option value="DKV 5">DKV 5</option>
          </optgroup>
          <optgroup label="KLN">
            <option value="Kuliner 1">Kuliner 1</option>
            <option value="Kuliner 2">Kuliner 2</option>
            <option value="Kuliner 3">Kuliner 3</option>
            <option value="Kuliner 4">Kuliner 4</option>
            <option value="Kuliner 5">Kuliner 5</option>
          </optgroup>
          <optgroup label="HTL">
            <option value="Hotel 1">Hotel 1</option>
            <option value="Hotel 2">Hotel 2</option>
            <option value="Hotel 3">Hotel 3</option>
            <option value="Hotel 4">Hotel 4</option>
            <option value="Hotel 5">Hotel 5</option>
          </optgroup>
          <optgroup label="PMN">
            <option value="Pemasaran 1">Pemasaran 1</option>
            <option value="Pemasaran 2">Pemasaran 2</option>
            <option value="Pemasaran 3">Pemasaran 3</option>
            <option value="Pemasaran 4">Pemasaran 4</option>
            <option value="Pemasaran 5">Pemasaran 5</option>
          </optgroup>
        </select>
      </div>
      `;

    const opsiRayonSiswaHTML = `
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Rayon</label></div>
        <select id="swal-rayon" class="form-control-modern">
          <option value="">Pilih Rayon</option>
          <optgroup label="Cicurug">
            <option value="Cicurug 1">Cicurug 1</option>
            <option value="Cicurug 2">Cicurug 2</option>
            <option value="Cicurug 3">Cicurug 3</option>
            <option value="Cicurug 4">Cicurug 4</option>
            <option value="Cicurug 5">Cicurug 5</option>
            <option value="Cicurug 6">Cicurug 6</option>
            <option value="Cicurug 7">Cicurug 7</option>
            <option value="Cicurug 8">Cicurug 8</option>
            <option value="Cicurug 9">Cicurug 9</option>
            <option value="Cicurug 10">Cicurug 10</option>
          </optgroup>
          <optgroup label="Cisarua">
            <option value="Cisarua 1">Cisarua 1</option>
            <option value="Cisarua 2">Cisarua 2</option>
            <option value="Cisarua 3">Cisarua 3</option>
            <option value="Cisarua 4">Cisarua 4</option>
            <option value="Cisarua 5">Cisarua 5</option>
            <option value="Cisarua 6">Cisarua 6</option>
            <option value="Cisarua 7">Cisarua 7</option>
          </optgroup>
          <optgroup label="Cibedug">
            <option value="Cibedug 1">Cibedug 1</option>
            <option value="Cibedug 2">Cibedug 2</option>
            <option value="Cibedug 3">Cibedug 3</option>
            <option value="Cibedug 4">Cibedug 4</option>
          </optgroup>
          <optgroup label="Sukasari">
            <option value="Sukasari 1">Sukasari 1</option>
            <option value="Sukasari 2">Sukasari 2</option>
          </optgroup>
          <optgroup label="Ciawi">
            <option value="Ciawi 1">Ciawi 1</option>
            <option value="Ciawi 2">Ciawi 2</option>
            <option value="Ciawi 3">Ciawi 3</option>
            <option value="Ciawi 4">Ciawi 4</option>
            <option value="Ciawi 5">Ciawi 5</option>
            <option value="Ciawi 6">Ciawi 6</option>
          </optgroup>
          <optgroup label="Tajur">
            <option value="Tajur 1">Tajur 1</option>
            <option value="Tajur 2">Tajur 2</option>
            <option value="Tajur 3">Tajur 3</option>
            <option value="Tajur 4">Tajur 4</option>
            <option value="Tajur 5">Tajur 5</option>
            <option value="Tajur 6">Tajur 6</option>
          </optgroup>
          <optgroup label="Wikrama">
            <option value="Wikrama 1">Wikrama 1</option>
            <option value="Wikrama 2">Wikrama 2</option>
            <option value="Wikrama 3">Wikrama 3</option>
            <option value="Wikrama 4">Wikrama 4</option>
            <option value="Wikrama 5">Wikrama 5</option>
          </optgroup>
        </select>
      `;

    const htmlSiswa = `${identitasHTML}
        ${roleSiswaHTML}
        ${opsiKelasHTML}
        ${opsiRombelSiswaHTML}
        ${opsiRayonSiswaHTML}`;

    const htmlGuru = `
      ${identitasHTML}
      <input type="hidden" id="swal-rombel" value="${escapeAttr(rombel || "Guru Produktif")}">
      <input type="hidden" id="swal-rayon" value="${escapeAttr(rayonDb || "Guru Produktif")}">
    `;

    const { value: formValues } = await Swal.fire({
      didOpen: () => {
        if (isTeacher) return;
        document.getElementById("swal-kelas").value = kelasDb;
        document.getElementById("swal-rombel").value = rombel;
        document.getElementById("swal-rayon").value = normalRayonEdit(rayonDb);
      },
      title: isTeacher ? "Edit Data Guru" : "Edit Data Siswa",
      html: isTeacher ? htmlGuru : htmlSiswa,
      customClass: {
        popup: isTeacher ? "sweetalert-popup swal-edit-guru" : "sweetalert-popup swal-edit-siswa",
      },
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Data",
      cancelButtonText: "Batal",
      preConfirm: () => {
        const ambilOpsi = (elmId, nilaiLama) =>
          document.getElementById(elmId)?.value.trim() ||
          String(nilaiLama || "").trim();

        const payload = {
          nis: document.getElementById("swal-nis").value.trim(),
          username: document.getElementById("swal-username").value.trim(),
          email: document.getElementById("swal-email").value.trim(),
          idcard: document.getElementById("swal-idcard").value.trim(),
          whatsapp: document.getElementById("swal-whatsapp").value.trim(),
        };

        if (isTeacher) {
          payload.role = "teacher";
          payload.rombel =
            ambilOpsi("swal-rombel", rombel) || "Guru Produktif";
          payload.rayon =
            ambilOpsi("swal-rayon", rayonDb) || "Guru Produktif";
        } else {
          payload.role = document.getElementById("swal-role")?.value || role;
          payload.kelas = ambilOpsi("swal-kelas", kelasDb);
          payload.rombel = ambilOpsi("swal-rombel", rombel);
          payload.rayon = ambilOpsi("swal-rayon", rayonDb);
        }

        return payload;
      },
    });

    if (!formValues) return;

    const updateResponse = await fetch(`${API_BASE}/api/users/id/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formValues),
    });

    if (!updateResponse.ok) {
      const errResult = await updateResponse.json().catch(() => ({}));
      throw new Error(errResult.message || "Gagal mengupdate data");
    }

    const updateResult = await updateResponse.json();

    showToast("Data berhasil diperbarui!", "success");
    loadTableSiswa();
  } catch (error) {
    Swal.fire("Gagal Update!", error.message, "error");
  }
}

function attachRombelFilterInput() {
  const select = document.getElementById("pilihanRombel");
  if (select) {
    select.removeEventListener("change", handleRombelFilterInput);
    select.addEventListener("change", handleRombelFilterInput);
  }
}

async function handleRombelFilterInput() {
  const selectElement = document.getElementById("pilihanRombel");
  if (!selectElement) return;
  currentSelectedRombel = selectElement.value || null;
  renderTable();
}

//detailsiswa
async function actionDetailSiswa(nis) {
  try {
    const response = await fetch(`${API_BASE}/api/users/${nis}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errResult = await response.json().catch(() => ({}));
      throw new Error(errResult.message || "Gagal mengambil data");
    }
    const result = await response.json();
  } catch (error) {
    Swal.fire("Gagal!", error.message, "error");
  }
}
