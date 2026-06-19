function renderInputSiswa() {
  return `
  <label for="nis">NIS / NIP</label><br>
  <input type="text" id="nis" placeholder="Nomor Induk Siswa / NIP Guru"><br>
  
  <label for="selectRole">PERAN</label><br>
  <select id="selectRole">
    <option value="">Pilih Peran</option>
    <option value="student">Siswa</option>
    <option value="teacher">Guru</option>
  </select><br>

  <label for="idKartu">UID RFID</label><br>
  <input type="password" id="RFID" placeholder="TEMPELKAN KARTU KE READER ATAU KETIK MANUAL"><br>
  <span>Tempelkan kartu RFID ke reader saat kursor di sini -- UID terisi otomatis.</span><br><br>

  <label for="username">NAMA LENGKAP</label><br>
  <input type="text" id="username" placeholder="Nama Lengkap"><br>

  <label for="email">EMAIL</label><br>
  <input type="text" id="email" placeholder="Example@smkwikrama.sch.id"><br>

  <label for="password">PASSWORD</label><br>
  <input type="password" id="password" placeholder="**********"><br>

  <label for="rombel">Rombel</label><br>
  <select id="rombel">
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
  </select><br>

  <button type="button" id="btnSave" class="btn-save">Simpan</button>

  <hr>
  <div class="d-flex">
    <h5>Daftar Siswa / Guru</h5>
    <div class="justify-content-end ms-auto">
      <input type="file" id="excelInput" accept=".xlsx, .xls, .csv" style="display: none;">
      <button type="button" id="btnImportExcel">Import Exel</button>
    </div>
  </div>
  <table class="table">
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
`;
}

function initInputSiswaListener() {
  loadTableSiswa();
  initImportExcelListener();

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

      const result = await response.json();

      if (!response.ok) {
        showToast("Terjadi kesalahan saat mendaftar", "danger");
        Swal.fire({
          title: "Registrasi Gagal!",
          text: result.message || "Gagal menyimpan ke database Supabase",
          icon: "error",
          customClass: {
            popup: "sweetalert-popup",
            confirmButton: "sweetalert-btn-error",
          },
          buttonsStyling: false,
        });
        return;
      }

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

    const response = await fetch("http://localhost:3000/api/users");
    const result = await response.json();

    if (!response.ok || !result.success) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Gagal memuat data siswa!</td></tr>`;
      return;
    }

    if (result.data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Belum ada data siswa terdaftar.</td></tr>`;
      return;
    }

    tableBody.innerHTML = "";

    result.data.forEach((user, index) => {
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
          <button class="btn-edit" data-nis="${user.nis}">📝</button>
          <button class="btn-delete" data-nis="${user.nis}">🗑️</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Panggil fungsi listener tombol aksi setelah tabel selesai dirender
    initActionButtonsListener();
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
            body: JSON.stringify({ users: jsonData }),
          },
        );

        const result = await response.json();

        if (!response.ok)
          throw new Error(result.message || "Gagal Menyimpan Massal!");

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

function initActionButtonsListener() {
  const tableBody = document.querySelector("#tableSiswaBody");
  if (!tableBody) return;

  // Gunakan Event Delegation biar listener klik nempel terus meskipun tabel direfresh harian
  tableBody.onclick = async (e) => {
    // 🗑️ LOGIKA TOMBOL DELETE
    if (
      e.target.classList.contains("btn-delete") ||
      e.target.closest(".btn-delete")
    ) {
      const button = e.target.classList.contains("btn-delete")
        ? e.target
        : e.target.closest(".btn-delete");
      const nis = button.getAttribute("data-nis");

      const confirm = await Swal.fire({
        title: "Yakin mau dihapus, bro?",
        text: `Data dengan NIS ${nis} bakal hilang permanen dari database.`,
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
        });
        const result = await response.json();

        if (!response.ok)
          throw new Error(result.message || "Gagal menghapus data");

        showToast("Data berhasil dihapus!", "success");
        loadTableSiswa();
      } catch (error) {
        Swal.fire("Gagal!", error.message, "error");
      }
    }

    // 📝 LOGIKA TOMBOL EDIT
    if (
      e.target.classList.contains("btn-edit") ||
      e.target.closest(".btn-edit")
    ) {
      const button = e.target.classList.contains("btn-edit")
        ? e.target
        : e.target.closest(".btn-edit");
      const nis = button.getAttribute("data-nis");
      actionEditSiswa(nis);
    }
  };
}

async function actionEditSiswa(nis) {
  try {
    const response = await fetch("http://localhost:3000/api/users");
    const result = await response.json();
    const currentUser = result.data.find((u) => u.nis == nis);

    if (!currentUser)
      return Swal.fire("Eror", "Data tidak ditemukan!", "error");

    const { value: formValues } = await Swal.fire({
      title: "Edit Data Siswa / Guru",
      html: `
        <div style="text-align: left; margin-bottom: 8px;"><label>Nama Lengkap</label></div>
        <input id="swal-username" class="swal2-input" style="margin-top:0;" value="${currentUser.username}">
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Email</label></div>
        <input id="swal-email" class="swal2-input" style="margin-top:0;" value="${currentUser.email}">
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>UID RFID</label></div>
        <input id="swal-idcard" class="swal2-input" style="margin-top:0;" value="${currentUser.idcard}">
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Peran</label></div>
        <select id="swal-role" class="swal2-input" style="margin-top:0; width: 100%; max-width: 100%;">
          <option value="student" ${currentUser.role === "student" ? "selected" : ""}>Siswa</option>
          <option value="teacher" ${currentUser.role === "teacher" ? "selected" : ""}>Guru</option>
        </select>
        <div style="text-align: left; margin-top: 15px; margin-bottom: 8px;"><label>Rombel (Contoh: X_3)</label></div>
        <input id="swal-rombel" class="swal2-input" style="margin-top:0;" value="${currentUser.rombel || ""}">
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
        body: JSON.stringify(formValues),
      },
    );

    const updateResult = await updateResponse.json();
    if (!updateResponse.ok)
      throw new Error(updateResult.message || "Gagal mengupdate data");

    showToast("Data berhasil diperbarui!", "success");
    loadTableSiswa();
  } catch (error) {
    Swal.fire("Gagal Update!", error.message, "error");
  }
}
