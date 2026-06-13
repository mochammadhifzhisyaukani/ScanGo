let content = document.getElementById("content");
content.innerHTML = `
          <div class="card animate__animated animate__zoomIn">
            <div class="left-panel">
                <div class="logo">
                    <a href="/index.html">
                      <img src="/frontEnd/assets/logo/favicon.png" alt="" width="60px">
                    </a>
                </div>

                <h1>Sign In</h1>
                <p class="subtitle">Continue to access your dashboard</p>

                <div class="field-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Enter your email" />
                </div>

                <div class="field-group">
                    <div class="field-header">
                        <label for="password">Password</label>
                        <span class="forgot-link">Forgot Password?</span>
                    </div>

                    <div class="password-wrapper">
                        <input type="password" id="password" placeholder="Enter your password" />

                        <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                    </div>
                </div>

                <button class="btn-signin">Sign In</button>

                <p class="create-account">Don't have an account? <a href="#">Contat your teacher</a></p>
            </div>

            <div class="right-panel">
                <img src="/frontEnd/assets/background/9333f00957425e173ae553ca70f5b930.png" alt="Login Banner">
            </div>
        </div>
`;

// ==================== SISA KODE SEBELUMNYA (TOGGLE & MANUAL LOGIN) ====================
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
    alert("Email dan Password tidak boleh kosong!");
    return;
  }

  btnSignIn.innerText = "Memproses...";
  btnSignIn.disabled = true;

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: passwordValue }),
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Gagal Login!");

    alert("Login Berhasil! Selamat Datang.");
    localStorage.setItem("role", data.user.role);
    localStorage.setItem("username", data.user.username);

    if (data.user.role.trim().toLowerCase() === "admin") {
      alert("Menuju halaman admin");
    } else {
      alert("Menuju halaman user");
    }
  } catch (error) {
    alert("Error: " + error.message);
  } finally {
    btnSignIn.innerText = "Sign In";
    btnSignIn.disabled = false;
  }
});
