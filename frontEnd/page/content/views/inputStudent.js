function renderInputSiswa() {
  return `
  <div id="formInputContainer" class="form-input-container" style="display: none;">

    <div class="back-link" id="btnBackToData">
      <i class="bi bi-arrow-left"></i> Kembali
    </div>

    <h2 class="form-title">
      Input Siswa Baru
    </h2>

    <form class="form-grid" id="formInputSiswa" autocomplete="off">

      <div class="form-group">
        <label class="form-label" for="nis">
          <i class="bi bi-person-vcard"></i> NIS / NIP
        </label>
        <input type="text" id="nis" class="form-control-modern" placeholder="Nomor Induk Siswa / NIP Guru">
      </div>

      <div class="form-group">
        <label class="form-label" for="selectRole">
          <i class="bi bi-shield-check"></i> Peran
        </label>
        <select id="selectRole" class="form-control-modern">
          <option value="">Pilih Peran</option>
          <option value="student">Siswa</option>
          <option value="teacher">Guru</option>
        </select>
      </div>

      <div class="form-group rfid-field">
        <label class="form-label" for="RFID">
          <i class="bi bi-rss"></i> UID RFID
        </label>
        <input type="password" id="RFID" class="form-control-modern" placeholder="Tempelkan kartu ke reader atau ketik manual">
        <span class="form-hint">
          <i class="bi bi-info-circle"></i> Tempelkan kartu RFID ke reader saat kursor di sini &mdash; UID terisi otomatis.
        </span>
      </div>

      <div class="form-group">
        <label class="form-label" for="username">
          <i class="bi bi-person"></i> Nama Lengkap
        </label>
        <input type="text" id="username" class="form-control-modern" placeholder="Nama Lengkap">
      </div>

      <div class="form-group">
        <label class="form-label" for="email">
          <i class="bi bi-envelope"></i> Email
        </label>
        <input type="text" id="email" class="form-control-modern" placeholder="example@smkwikrama.sch.id">
      </div>

      <div class="form-group">
        <label class="form-label" for="password">
          <i class="bi bi-lock"></i> Password
        </label>
        <input type="password" id="password" class="form-control-modern" placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;">
      </div>

      <div class="form-group full-width">
        <label class="form-label" for="rombel">
          <i class="bi bi-people"></i> Rombel
        </label>
        <select id="rombel" class="form-control-modern">
          <option value="">Pilih Rombel</option>
          <optgroup label="PPLG X">
            <option value="X_1">PPLG X-1</option>
            <option value="X_2">PPLG X-2</option>
            <option value="X_3">PPLG X-3</option>
            <option value="X_4">PPLG X-4</option>
            <option value="X_5">PPLG X-5</option>
          </optgroup>
          <optgroup label="PPLG XI">
            <option value="XI_1">PPLG XI-1</option>
            <option value="XI_2">PPLG XI-2</option>
            <option value="XI_3">PPLG XI-3</option>
            <option value="XI_4">PPLG XI-4</option>
            <option value="XI_5">PPLG XI-5</option>
          </optgroup>
          <optgroup label="PPLG XII">
            <option value="XII_1">PPLG XII-1</option>
            <option value="XII_2">PPLG XII-2</option>
            <option value="XII_3">PPLG XII-3</option>
            <option value="XII_4">PPLG XII-4</option>
            <option value="XII_5">PPLG XII-5</option>
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

  <div id="dataContainer" class="data-container">
    <div class="data-card">
      <div class="table-header">
        <h5 class="table-title">
          Daftar Siswa / Guru
        </h5>
        <div class="table-actions">
            <select id="pilihanRombel" class="form-select form-select-sm bg-light border-0 text-muted rounded-3" style="width: auto; height: 34px; font-size: 0.85rem;">
              <option value="">Rombel</option>
              <optgroup label="PPLG X">
                <option value="X_1">PPLG X-1</option>
                <option value="X_2">PPLG X-2</option>
                <option value="X_3">PPLG X-3</option>
                <option value="X_4">PPLG X-4</option>
                <option value="X_5">PPLG X-5</option>
              </optgroup>
              <optgroup label="PPLG XI">
                <option value="XI_1">PPLG XI-1</option>
                <option value="XI_2">PPLG XI-2</option>
                <option value="XI_3">PPLG XI-3</option>
                <option value="XI_4">PPLG XI-4</option>
                <option value="XI_5">PPLG XI-5</option>
              </optgroup>
              <optgroup label="PPLG XII">
                <option value="XII_1">PPLG XII-1</option>
                <option value="XII_2">PPLG XII-2</option>
                <option value="XII_3">PPLG XII-3</option>
                <option value="XII_4">PPLG XII-4</option>
                <option value="XII_5">PPLG XII-5</option>
              </optgroup>
            </select>

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
              <th>Nama</th>
              <th>Rombel</th>
              <th>UID RFID</th>
              <th>Status</th>
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

  const btnDaftar = document.querySelector(".btn-save");
  if (!btnDaftar) return;

  btnDaftar.addEventListener("click", async function (e) {
    e.preventDefault();

    const IdRfidInput = document.getElementById("RFID");
    const nisInput = document.getElementById("nis");
    const rombelInput = document.getElementById("rombel");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("selectRole");

    if (
      !IdRfidInput ||
      !nisInput ||
      !rombelInput ||
      !usernameInput ||
      !emailInput ||
      !passwordInput ||
      !roleInput
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
    const role = roleInput.value.trim();

    if (
      !username ||
      !email ||
      !password ||
      !rombel ||
      !idcard ||
      !nis ||
      !role
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

    try {
      btnDaftar.disabled = true;
      btnDaftar.innerText = "Memproses...";

      const response = await fetch("http://localhost:3000/api/auth/register", {
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
      rombelInput.value = "";
      nisInput.value = "";
      IdRfidInput.value = "";
      roleInput.value = "";

      document.getElementById("formInputContainer").style.display = "none";
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
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Memuat data...</td></tr>`;

    const response = await fetch("http://localhost:3000/api/users", {
      method: "GET",
      credentials: "include"
    });

    if (!response.ok) {
      const errResult = await response.json().catch(() => ({}));
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data siswa: ${errResult.message || response.statusText}</td></tr>`;
      return;
    }

    const result = await response.json();

    if (!result.success) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data siswa!</td></tr>`;
      return;
    }

    if (result.data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data siswa terdaftar.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    result.data.forEach((user, index) => {
      const userEmail = user.email || user.Email || "";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>
          <strong>${user.username}</strong><br>
          <small style="color:#6c757d;">${user.nis}</small> 
          <span class="badge-${user.role === "teacher" ? "guru" : "siswa"}">${user.role === "teacher" ? "Guru" : "Siswa"}</span>
        </td>
        <td>${user.rombel || "-"}</td>
        <td><code>${user.idcard}</code></td>
        <td><span class="status-aktif">Aktif</span></td>
        <td>
          <button class= "btn-detail btn btn-secondary btn-sm" data-nis="${user.nis}" data-email="${userEmail}"><i class="bi bi-eye"></i></button>
          <button class="btn-edit btn btn-primary btn-sm" data-nis="${user.nis}" data-email="${userEmail}"><i class="bi bi-pencil-square"></i></button>
          <button class="btn-delete btn btn-danger btn-sm" data-nis="${user.nis}"><i class="bi bi-trash"></i></button>
        </td>
  
      `;
      tableBody.appendChild(row);
    });

    initActionButtonsListener();
    attachRombelFilterInput();
  } catch (error) {
    console.error("Error loading table: ", error);
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Koneksi ke server terputus!</td></tr>`;
  }
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

        const response = await fetch(
          "http://localhost:3000/api/auth/register-bulk",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ users: jsonData }),
          },
        );

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
    document.getElementById("formInputContainer").style.display = "block";
  }

  function showData() {
    document.getElementById("formInputContainer").style.display = "none";
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

      const confirm = await Swal.fire({
        title: "Yakin mau dihapus?",
        text: `Data dengan NIS ${nis} akan hilang permanen dari database.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Ya, Hapus!",
        cancelButtonText: "Batal",
      });

      if (!confirm.isConfirmed) return;

      try {
        const response = await fetch(`http://localhost:3000/api/users/${nis}`, {
          method: "DELETE",
          credentials: "include"
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
      const nis = button.getAttribute("data-nis");
      const email = button.getAttribute("data-email");
      actionEditSiswa(nis, email);
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
        nis: nis
      };

      navigateTo("detail-siswa");
    }
  };
}

async function actionEditSiswa(nis, email) {
  try {
    const row = document
      .querySelector(`button[data-nis="${nis}"]`)
      .closest("tr");
    if (!row) return Swal.fire("Eror", "Baris data tidak ditemukan!", "error");

    const username = row.cells[1].querySelector("strong").innerText.trim();
    const badgeText = row.cells[1]
      .querySelector("span")
      .innerText.trim()
      .toLowerCase();
    const role = badgeText === "guru" ? "teacher" : "student";
    const rombel =
      row.cells[2].innerText.trim() === "-"
        ? ""
        : row.cells[2].innerText.trim();
    const idcard = row.cells[3].querySelector("code").innerText.trim();

    const { value: formValues } = await Swal.fire({
      title: "Edit Data Siswa / Guru",
      html: `
        <div style="text-align: left; margin-bottom: 8px;">
        <label>Nama Lengkap</label></div>
        <input id="swal-username" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;" value="${username}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>Email</label></div>
        <input id="swal-email" class="swal2-input" style="margin-top:0;" value="${email}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>UID RFID</label></div>
        <input id="swal-idcard" class="swal2-input" style="margin-top:0;" value="${idcard}">

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;">
        <label>Peran</label></div>
        <select id="swal-role" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;">
          <option value="student" ${role === "student" ? "selected" : ""}>Siswa</option>
          <option value="teacher" ${role === "teacher" ? "selected" : ""}>Guru</option>
        </select>

        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Rombel (Contoh: X_3)</label></div>
        <input id="swal-rombel" class="swal2-input" style="margin-top:0;" value="${rombel}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update Data",
      cancelButtonText: "Batal",
      preConfirm: () => {
        return {
          username: document.getElementById("swal-username").value.trim(),
          email: document.getElementById("swal-email").value.trim(),
          idcard: document.getElementById("swal-idcard").value.trim(),
          role: document.getElementById("swal-role").value,
          rombel: document.getElementById("swal-rombel").value.trim(),
        };
      },
    });

    if (!formValues) return;

    const updateResponse = await fetch(
      `http://localhost:3000/api/users/${nis}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formValues),
      },
    );

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

  const tableBody = document.querySelector("#tableSiswaBody");
  if (!tableBody) return;

  const rows = tableBody.querySelectorAll("tr");
  let visibleCount = 0;

  rows.forEach((row) => {
    const rombelCell = row.querySelector("td:nth-child(3)");
    if (!rombelCell) return;

    const rombelText = rombelCell.textContent.trim();
    const match = !currentSelectedRombel || rombelText === currentSelectedRombel;

    row.style.display = match ? "" : "none";
    if (match) visibleCount++;
  });

  const emptyRow = tableBody.querySelector(".empty-filter-row");
  if (emptyRow) emptyRow.remove();

  if (visibleCount === 0 && currentSelectedRombel) {
    const tr = document.createElement("tr");
    tr.className = "empty-filter-row";
    tr.innerHTML = `<td colspan="6" style="text-align:center; padding:24px; color:#6c757d;">Siswa belum absen</td>`;
    tableBody.appendChild(tr);
  }
}

//detailsiswa
async function actionDetailSiswa(nis) {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${nis}`, {
      method: "GET",
      credentials: "include"
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