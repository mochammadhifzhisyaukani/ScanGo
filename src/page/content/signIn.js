let content = document.getElementById("content");

content.innerHTML = `<div class="grid text-center">
                <div class="g-col-4">
                    <h1>Sign In</h1>
                    <p>Sign In for start the experience</p>

                    <label for="email">Username or Email</label><br>
                    <input type="email" placeholder="Usernama or Email"><br>


                    <label for="Password">Password</label><br>

                    <!-- Example icon usage -->
                    <div class="password-wrapper">
                        <input type="password" id="password" placeholder="Password">
                        <i class="bi bi-eye-slash" id="togglePassword"></i>
                    </div>



                    <div class="button">
                    <a href="">Submit</a>


                    </div>
                    <h6>Don’t have a account?</h6>

                    <div class="button">


                    <a href="">Create new account</a>
                    </div>
                    
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
