const content = document.getElementById("content");
content.innerHTML = `
<div class="container-fluid p-0">
    <div class="row min-vh-100 g-0">

        <div class="col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white contact-left-side">
            
            <div class="">
              <a href="/index.html" class="text-decoration-none text-white d-flex gap-3">
                <img src="/src/assets/logo/favicon.png" class="animate__animated animate__fadeInLeft" style="height: 50px;">
                <h1 class="fw-bold mb-3 animate__animated animate__fadeInDown">ScanGo</h1>

                <div id="changeTheme" class="justify-content-end ms-auto animate__animated animate__jackInTheBox mt-3"></div>
              </a>
            </div>

            <div class="mb-3">
                <div class="mb-4">
                    <h1 class="animate__animated animate__jackInTheBox">"No more queues, no more paperwork. Just scan and you are good to go."</h1>
                </div>

                <div class="mb-0 mt-5 animate__animated animate__fadeInUp">
                    <h5 class="fw-bold mb-2"><i class="bi bi-lightbulb me-2 contact-icon"></i> Feedback and Suggestions</h5>
                    <p class="contact-desc-small">We value your feedback and are continuously working to improve ScanGo. Your input is crucial in shaping the future of ScanGo.</p>
                    <a src="" class="text-white">Want to Collaborate?</a>
                </div>
            </div>
        </div>

        <div class="col-12 col-md-6 d-flex align-items-center justify-content-center contact-right-side">
            
            <div class="w-100 contact-form-card animate__animated animate__bounceInLeft" style="color: var(--teks-form) !important;">
                <div class="text-center mb-4">
                    <div class="d-inline-flex p-3 bg-light rounded-circle mb-3" style="background: #e67e22 !important;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="white" class="bi bi-person-lines-fill" viewBox="0 0 16 16">
                            <path d="M6 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6m-5 6s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zM11 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm2 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1z" />
                        </svg>
                    </div>
                    <h1 class="fw-bold m-0">Give your best advice</h1>
                    <p class="text-muted small" style="color: var(--teks-form) !important;">You can reach us anytime</p>
                </div>

                <form id="contact">
                    <div class="mb-3">
                        <label for="nama" class="form-label contact-label">Nama Lengkap</label>
                        <input type="text" class="form-control contact-input" id="nama" placeholder="Masukkan nama anda" required>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label contact-label">Email Address</label>
                        <div class="input-group">
                            <span class="input-group-text contact-input-addon"><i class="bi bi-envelope"></i></span>
                            <input type="email" class="form-control contact-input" id="email" placeholder="Masukkan email anda" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="tel" class="form-label contact-label">Nomor Telepon</label>
                        <div class="input-group">
                            <span class="input-group-text contact-input-addon"><i class="bi bi-telephone"></i></span>
                            <input type="tel" class="form-control contact-input" id="tel" placeholder="0812-3456-7890" required>
                        </div>
                    </div>

                    <div class="mb-4">
                        <label for="ulasan" class="form-label contact-label">Pesan Anda</label>
                        <textarea class="form-control contact-input" name="ulasan" id="ulasan" rows="4" placeholder="Masukkan pesan anda" required></textarea>
                    </div>

                    <button type="submit" class="contact-btn-submit w-100 fw-semibold shadow-sm mb-4">Submit Message</button>

                    <p class="contact-terms-text text-center m-0">
                        By contacting us, you agree to our <a href="#" class="text-decoration-none">Terms of Service</a> and <a href="#" class="text-decoration-none">Privacy Policy</a>.
                    </p>
                </form>

            </div>
        </div>

    </div>
</div>`;

// Whatsapp Form Submission
const contactForm = document.getElementById("contact");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nama = document.getElementById("nama").value;
    const email = document.getElementById("email").value;
    const telepon = document.getElementById("tel").value;
    const pesan = document.getElementById("ulasan").value;

    if (!nama || !email || !telepon || !pesan) {
      alert("Harap isi semua field sebelum submit!");
      return;
    }

    const nomorWA = "6289517354572";
    const teks = `Halo Min, ada pesan baru dari website: ScanGo\n\nNama: ${nama}\nEmail: ${email}\nNomor Telephone: ${telepon}\nPesan: ${pesan}`;
    const url =
      "https://wa.me/" + nomorWA + "?text=" + encodeURIComponent(teks);

    window.open(url, "_blank");

    alert("Pesan Anda akan diarahkan ke WhatsApp 🚀");
    this.reset();
  });
}
