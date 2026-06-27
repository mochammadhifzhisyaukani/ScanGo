let content = document.getElementById("content");
content.innerHTML = `
        <div class="card animate__animated animate__zoomIn">
            <a href="/index.html" class="back-link"><i class="bi bi-house"></i> Kembali</a>
            <div class="left-panel">
                <div class="logo">
                    <a href="/index.html">
                        <img src="/frontEnd/assets/logo/favicon.png" alt="ScanGo Logo" width="60px">
                    </a>
                </div>

                <h1>Masuk</h1>
                <p class="subtitle">Masuk untuk memulai absensi</p>

                <div class="field-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" autocomplete="email" />
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="password">Password</label>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="forgot-link">Lupa Password?</a>
                    </div>

                    <div class="password-wrapper">
                        <input type="password" id="password" placeholder="Enter your password" autocomplete="current-password" />
                        <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                    </div>
                </div>

                <button class="btn-signin">Masuk</button>

                <p class="create-account">Tidak memiliki akun? <a href="#">Hubungi staf Scango</a></p>
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
                <p>Silahkan untuk menghubungi staf Scango untuk mengganti password!</p>
              </div>
              <div class="modal-footer">
                <button type="button" class="w-100 btn btn-success" data-bs-dismiss="modal">Mengerti</button>
              </div>
            </div>
          </div>
        </div>
`;

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);
  this.classList.toggle("bi-eye");
  this.classList.toggle("bi-eye-slash");
});

const btnSignIn = document.querySelector(".btn-signin");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");

btnSignIn.addEventListener("click", async function (e) {
  e.preventDefault();
  const email = emailInput.value.trim();
  const passwordValue = passwordInput.value.trim();

  if (!email || !passwordValue) {
    showToast("Email dan Password tidak boleh kosong!", "danger");
    Swal.fire({
      title: "Login Gagal",
      icon: "error",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-error",
      },
      buttonsStyling: false,
    });
    return;
  }

  btnSignIn.innerText = "Memproses...";
  btnSignIn.disabled = true;

try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: passwordValue }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal Login!");

    const userRole = data.user.role ? data.user.role.trim().toLowerCase() : "";

    if (userRole === "student" || userRole === "siswa") {
      showToast("Akses ditolak! Akun Student tidak diizinkan masuk ke panel ini.", "danger");
      Swal.fire({
        title: "Login Gagal",
        text: "Anda tidak memiliki hak akses administrator.",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },
        buttonsStyling: false,
      });
      return;
    }

    localStorage.setItem("role", data.user.role);
    localStorage.setItem("username", data.user.username || data.user.email);

    showToast("Login Berhasil! Selamat Datang.", "success");

    Swal.fire({
      title: "Login Berhasil",
      icon: "success",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-success",
      },
      buttonsStyling: false,
    }).then(() => {
      if (userRole === "admin") {
        showToast("Menuju halaman dashboard (Admin)", "success");
        window.location.href = "/frontEnd/page/structure/dashboard.html";
      } else {
        showToast("Menuju halaman index", "success");
        window.location.href = "/index.html";
      }
    });
  } catch (error) {
    showToast(`Error: ${error.message}`, "danger");
    Swal.fire({
      title: "Login Gagal",
      text: error.message,
      icon: "error",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-error",
      },
      buttonsStyling: false,
    });
    console.error("Error: ", error.message);
  } finally {
    btnSignIn.innerText = "Masuk";
    btnSignIn.disabled = false;
  }
});