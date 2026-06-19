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
  <input type="number" id="idKartu" placeholder="TEMPELKAN KARTU KE READER ATAU KETIK MANUAL"><br>
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
`;
}

function initInputSiswaListener() {
  const btnDaftar = document.querySelector(".btn-save");

  if (!btnDaftar) return;

  btnDaftar.addEventListener("click", async function (e) {
    e.preventDefault();

    const IdRfidInput = document.getElementById("idKartu");
    const nisInput = document.getElementById("nis");
    const rombelInput = document.getElementById("rombel");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const roleInput = document.getElementById("selectRole");

    // Cek dulu apakah semua inputan sukses ditemukan di DOM
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
    // 🔹 FIX: Diubah dari role.value jadi roleInput.value
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
        headers: {
          "Content-Type": "application/json",
        },
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

      showToast("Akun siswa baru berhasil ditambahkan!", "success");
      Swal.fire({
        title: "Registrasi Berhasil!",
        icon: "success",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },
        buttonsStyling: false,
      });

      // Reset form setelah sukses
      usernameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      rombelInput.value = "";
      nisInput.value = "";
      IdRfidInput.value = "";
      roleInput.value = "";
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

// 🔹 FUNGSI TAMBAHAN: Biar showToast() gak bikin eror lagi, kita manfaatin built-in toast bawaan SweetAlert2
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
