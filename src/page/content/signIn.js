// let content = document.getElementById("content");

// content.innerHTML = ``;

const togglePassword = document.querySelector("#togglePassword");
const password = document.querySelector("#password");

togglePassword.addEventListener("click", function () {
  // toggle password/text
  const type =
    password.getAttribute("type") === "password" ? "text" : "password";

  password.setAttribute("type", type);

  // toggle icon
  this.classList.toggle("bi-eye");
  this.classList.toggle("bi-eye-slash");
});
