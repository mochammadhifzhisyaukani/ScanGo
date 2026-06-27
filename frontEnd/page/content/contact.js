const content = document.getElementById("content");
content.innerHTML = `
<div class="container-fluid p-0">
    <div class="row min-vh-100 g-0">

        <div class="col-md-6 d-none d-md-flex flex-column justify-content-between p-5 text-white contact-left-side">
            
            <div class="">
              <a href="/index.html" class="text-decoration-none text-white d-flex gap-3">
                <a href="/index.html" class="text-white text-decoration-none d-flex gap-2">
                    <i class="bi bi-house-fill"></i>
                    <span>Beranda</span>

                    <div class="changeTheme justify-content-end ms-auto animate__animated animate__jackInTheBox mt-3"></div>
                </a>
              </a>
            </div>

            <div class="mb-3">
                <div class="mb-4">
                    <h1 class="animate__animated animate__jackInTheBox">"Tidak perlu lagi berteriak, Cukup pindai dan Anda siap belajar!."</h1>
                </div>

                <div class="mb-0 mt-5 animate__animated animate__fadeInUp">
                    <h5 class="fw-bold mb-2"><i class="bi bi-lightbulb me-2 contact-icon"></i> Umpan Balik dan Saran</h5>
                    <p class="contact-desc-small">Kami menghargai masukan Anda dan terus berupaya untuk meningkatkan ScanGo. Masukan Anda sangat penting dalam membentuk masa depan ScanGo.</p>
                </div>
            </div>
        </div>

        <div class="col-12 col-md-6 d-flex align-items-center justify-content-center contact-right-side">
            
            <div class="w-100 contact-form-card animate__animated animate__bounceInLeft" style="color: var(--teks-form) !important;">
                <div class="text-center mb-4">
                    <h1 class="fw-bold m-0">Hubungi Kami!</h1>
                    <p class="text-muted small" style="color: var(--teks-form) !important;">Mempunyai kritik dan saran? hubungi kami kapan saja.</p>
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

                    <button type="submit" class="contact-btn-submit w-100 fw-semibold shadow-sm mb-4">Kirim Pesan</button>

                    <p class="contact-terms-text text-center m-0">
                        Dengan menghubungi kami, Anda menyetujui ketentuan kami. <a href="#" class="text-decoration-none">Ketentuan Layanan</a> dan <a href="#" class="text-decoration-none">Kebijakan Privasi</a>.
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
