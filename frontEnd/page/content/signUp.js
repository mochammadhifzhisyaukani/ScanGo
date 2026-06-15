let content = document.getElementById("content");
content.innerHTML = `
        <div class="card animate__animated animate__zoomIn">
            <div class="left-panel">

                <h1>Input Siswa Baru</h1>
                <p class="subtitle">Buat akun siswa hanya disini</p>

                <div class="field-group">
                    <div class="field-header">
                        <label for="">ID Kartu</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="text" id="IDKartu" placeholder="Masukkan ID Kartu" required />
                    </div>
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="nis">Nis</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="text" id="nis" placeholder="Masukkan Nis Siswa" required />
                    </div>
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="rombel">Rombel</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="text" id="rombel" placeholder="Masukkan Rombel Siswa" required />
                    </div>
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="username">Username</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="text" id="username" placeholder="Masukkan Username Siswa" required />
                    </div>
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="email">Email</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="email" id="email" placeholder="Masukkan Email Siswa" required />
                    </div>
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="password">Password</label>
                    </div>

                    <div class="password-wrapper">
                        <input type="password" id="password" placeholder="Masukkan Password Siswa" required />
                    </div>
                </div>

                <button class="btn-signin">Daftar</button>
            </div>

            <div class="right-panel">
                <img src="/frontEnd/assets/background/9333f00957425e173ae553ca70f5b930.png" alt="Login Banner">
            </div>
        </div>

        <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <p>Silahkan untuk menghubungi guru jurusan untuk mengganti password!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="w-100 btn btn-success" data-bs-dismiss="modal">Mengerti</button>
              </div>
            </div>
          </div>
        </div>
`;

function initRegisterHandler() {
  const btnDaftar = document.querySelector(".btn-signin");

  if (!btnDaftar) return;

  btnDaftar.addEventListener("click", async function (e) {
    e.preventDefault();

    const IDCardInput = document.getElementById("IDKartu");
    const nisInput = document.getElementById("nis");
    const rombelInput = document.getElementById("rombel");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    const idcard = IDCardInput.value.trim();
    const nis = nisInput.value.trim();
    const rombel = rombelInput.value.trim();
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const role = "user";

    if (!username || !email || !password || !rombel || !idcard || !nis) {
      showToast("Wajib mengisi semua kolom input!", "danger");
      Swal.fire({
        title: "Register Error",
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
        body: JSON.stringify({ username, email, password, role, idcard, rombel, nis }),
      });

      const result = await response.json();

      if (!response.ok) {
        showToast("Terjadi kesalahan saat mendaftar", "danger");
        Swal.fire({
          title: "Registrasi Gagal!",
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

      usernameInput.value = "";
      emailInput.value = "";
      passwordInput.value = "";
      rombelInput.value = "";
      nisInput.value = "";
      IDCardInput.value = "";
    } catch (error) {
      showToast("Gagal terhubung ke server backend");
      console.error("Error Register: ", error);

      Swal.fire({
        title: "Registrasi Error",
        icon: "error",
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
    } finally {
      btnDaftar.disabled = false;
      btnDaftar.innerText = "Daftar";
    }
  });
}

initRegisterHandler();
