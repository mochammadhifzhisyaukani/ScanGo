let content = document.getElementById("content");

content.innerHTML = `<div class="grid text-center">
                <div class="g-col-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-box-arrow-in-right text-center text-black mt-3" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0z"/>
  <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg>

                    <h3 class="text-center mt-5">Sign In</h3>
                    <p class="text-center">Sign In for start the experience</p>

                    <label for="email">Username or Email</label><br>
                    <input type="email" placeholder="Usernama or Email"><br>


                    <label for="Password">Password</label><br>

                    <!-- Example icon usage -->
                    <div class="password-wrapper">
                        <input type="password" id="password" placeholder="Password">
                        <i class="bi bi-eye-slash" id="togglePassword"></i>
                    </div>





                    <button><a href="">Sign In</a></button>

                    <h6>Don’t have a account?</h6>

                    <button><a href="">Create new account</a></button>
                </div> 
            </div>`;

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
