const footer = document.getElementById("footer");

footer.innerHTML = `
<footer class="footer-section py-5 reveal animate__animated animate__fadeIn w-100">
  <div class="container-fluid">
    <div class="footer-card bg-white p-5 shadow-sm">
      <div class="row gy-4">
        
        <div class="col-lg-6">
        <b><h3 style="font-size: 35px;background: black; -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: bold;">ScanGo</h3></b>
          <p class="text-muted  mt-3">
            Jl. Raya Wangun, Kelurahan Sindangsari,<br>
            Kecamatan Bogor Timur, Kota Bogor, Jawa Barat<br>
            16146.
          </p>
        </div>

        <div class="col-lg-2 col-6">
          <h6 class="fw-bold">Sumber Daya</h6>
          <ul class="list-unstyled text-muted">
            <li class="mb-2"><a href="/frontEnd/page/structure/assets.html" class="text-secondary text-decoration-none">Sumber</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-6">
          <h6 class="fw-bold">Perusahaan</h6>
          <ul class="list-unstyled text-muted">
            <li class="mb-2"><a href="/frontend/page/structure/about.html" class="text-secondary text-decoration-none">Tentang</a></li>
            <li class="mb-2"><a href="/frontend/page/structure/contact.html" class="text-secondary text-decoration-none">Kontak</a></li>
          </ul>
        </div>

        <div class="col-lg-2 col-6">
          <h6 class="fw-bold">Produk</h6>
          <ul class="list-unstyled text-muted">
            <li class="mb-2"><a href="/frontEnd/page/structure/signIn.html" class="text-secondary text-decoration-none">Kehadiran</a></a></li>
            <li class="mb-2"><a href="/frontEnd/page/structure/ourEcosystem.html" class="text-secondary text-decoration-none">Mitra</a></li>
            <li class="mb-2"><a href="/frontEnd/page/structure/guide.html" class="text-secondary text-decoration-none">Panduan</a></li>
          </ul>
        </div>
      </div>

      <hr class="mt-5 mb-3">
      <div class="row align-items-center">
        <div class="col-md-6">
          <small class="text-muted">© 2026 ScanGo. Semua Hak dilindungi Udang-undang</small>
        </div>
        <div class="col-md-6 text-md-end">
          <a href="#" class="text-muted text-decoration-underline small">Pengaturan Cookie</a>
        </div>
      </div>
    </div>
  </div>
</footer>

`;
