let signUp = document.getElementById('content');

signUp.innerHTML= `<div class="grid text-center">
            <div class="g-col-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                    class="bi bi-person-plus text-center text-black mt-3" viewBox="0 0 16 16">
                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                    <path fill-rule="evenodd"
                        d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                </svg>

                <h1 class="mt-5">Sign Up</h1>
                <p>Sign Up for start the experience</p>

                <label for="Username">Username</label><br>
                <input type="text" placeholder="Username"><br>

                <label for="email">Email</label><br>
                <input type="email" placeholder="Email"><br>


                <label for="Password">Password</label><br>

                <!-- Example icon usage -->
                <div class="password-wrapper">
                    <input type="password" id="password" placeholder="Password">
                    <i class="bi bi-eye-slash" id="togglePassword"></i>
                </div>



                <div class="button">
                    <a href="">Sign Up</a>
                </div>

                <h6>or Sign up with</h6>

                <div class="social-icons d-flex justify-content-center gap-5 mt-4">
                    <div class="icon">
                        <a href="#" class="text-decoration-none">
                            <i class="bi bi-google" style="font-size: 2rem; color: #DB4437;"></i>
                        </a>
                    </div>

                    <div class="icon">
                        <a href="#" class="text-decoration-none">
                            <i class="bi bi-facebook" style="font-size: 2rem; color: #1877F2;"></i>
                        </a>
                    </div>

                    <div class="icon">
                        <a href="#" class="text-decoration-none">
                            <i class="bi bi-apple" style="font-size: 2rem; color: black;"></i>
                        </a>
                    </div>

                </div>


            </div>
        </div>`


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
