const signUp = document.getElementById("content");

// 1. Inject HTML ke dalam div #content
signUp.innerHTML = `
<div class="card">
    <div class="left-panel">
        <img src="/src/assets/background/9333f00957425e173ae553ca70f5b930.png" alt="Login Banner">
    </div>

    <div class="right-panel">
        <div class="logo">
            <img src="/src/assets/logo/favicon.png" alt="Logo" width="60px">
        </div>

        <h1>Create Account</h1>
        <p class="subtitle">Create your account to get started</p>

        <button class="sso-btn" type="button">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
        </button>

                <button class="sso-btn">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#111">
                        <path
                            d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.3.07 2.2.75 2.97.8.9-.13 1.76-.84 3.1-.9 1.24.05 2.34.47 3.16 1.35-2.82 1.78-2.38 5.7.28 6.84-.65 1.76-1.5 3.5-1.51 4.79zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Sign in with Apple
                </button>

        <div class="or-divider">OR</div>

        <form id="registerForm">
            <div class="field-group">
                <label for="fullname">Full Name</label>
                <input type="text" id="fullname" placeholder="Enter your full name" required>
            </div>

            <div class="field-group">
                <label for="email">Email</label>
                <input type="email" id="email" placeholder="Enter your email" required>
            </div>

            <div class="field-group">
                <div class="field-header">
                    <label for="password">Password</label>
                </div>
                <div class="password-wrapper">
                    <input type="password" id="password" placeholder="Enter your password" required>
                    <i class="bi bi-eye-slash toggle-password" id="togglePassword"></i>
                </div>
            </div>

            <div class="field-group">
                <label for="confirmPassword">Confirm Password</label>
                <div class="password-wrapper">
                    <input type="password" id="confirmPassword" placeholder="Confirm your password" required>
                    <i class="bi bi-eye-slash toggle-password" id="toggleConfirmPassword"></i>
                </div>
            </div>

            <div class="terms">
                <input type="checkbox" id="terms" required>
                <label for="terms">I agree to the Terms & Conditions</label>
            </div>

            <button class="btn-signin" type="submit">
                Create Account
            </button>
        </form>

        <p class="create-account">
            Already have an account? <a href="signIn.html">Sign In</a>
        </p>
    </div>
</div>`;

// 2. Deklarasi Elemen HANYA SEKALI setelah HTML di-inject
const form = document.getElementById("registerForm");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");
const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

// 3. Fungsi Toggle Mata Password
function setupPasswordToggle(inputEl, toggleIcon) {
  toggleIcon.addEventListener("click", function () {
    const type =
      inputEl.getAttribute("type") === "password" ? "text" : "password";
    inputEl.setAttribute("type", type);
    this.classList.toggle("bi-eye");
    this.classList.toggle("bi-eye-slash");
  });
}

// Jalankan fungsi toggle untuk kedua kolom password
setupPasswordToggle(password, togglePassword);
setupPasswordToggle(confirmPassword, toggleConfirmPassword);

// 4. Validasi Form saat Submit
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah reload halaman

  if (password.value !== confirmPassword.value) {
    alert("Oops! Password and Confirm Password do not match.");
    confirmPassword.focus();
    return;
  }

  // Jika semua validasi lolos
  alert("Account created successfully!");
});
