const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  // ubah type input
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";
  password.setAttribute("type", type);

  // ubah icon
  this.classList.toggle("bi-eye-slash");
  this.classList.toggle("bi-eye");
});
