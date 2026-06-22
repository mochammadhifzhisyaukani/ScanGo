const navbar = document.getElementById("navbar");
navbar.innerHTML = `
<nav class="navbar navbar-expand-lg mt-4 animate__animated animate__fadeIn mt-3">
  <div class="container-fluid d-flex align-items-center"> <div class="d-flex align-items-center style-brand">
      <img src="/frontEnd/assets/logo/favicon.png" style="height: 40px;" class="ms-4">
      <a class="navbar-brand ms-3" href="/index.html" style="font-weight: bold; font-size: 25px; background: black; -webkit-background-clip: text; -webkit-text-fill-color: transparent;">ScanGo</a>
    </div>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
      <div class="navbar-nav d-flex justify-content-between align-items-center w-100 mt-2 mt-lg-0">
        
        <div class="d-flex flex-column flex-lg-row gap-2 gap-lg-4 mx-lg-auto">
          <a class="nav-link active text-center" aria-current="page" href="/index.html">Beranda</a>     
          <a class="nav-link text-center" href="/frontEnd/page/structure/guide.html">Panduan</a>
          <a class="nav-link text-center" href="/frontend/page/structure/about.html">Tentang</a>
          <a class="nav-link text-center" href="/frontend/page/structure/company.html">Pengembang</a>
        </div>

        <div class="d-flex justify-content-center gap-2">
          <button type="button" id="btnTema" class="nav-link text-center btn-theme px-4"><i class="bi bi-gear-fill" style="margin-right: 5px;"></i> Pengaturan</button>
        </div>

        <div id="menuAksesibilitas" class="accessibility-dropdown d-none animate__animated animate__fadeIn">
          <div class="d-flex">
            <h6 class="mt-2">Mode Terang/Gelap</h6>
            <div class="justify-content-end ms-auto" id="changeTheme"></div>
          </div>
        </div>
      </div>
    </div>

  </div>
</nav>

`;

function initAccessibilityModal() {
  const btnTema = document.getElementById("btnTema");
  const menuAksesibilitas = document.getElementById("menuAksesibilitas");

  if (!btnTema || !menuAksesibilitas) return;

  // 1. Klik tombol buat Toggle (Muncul / Sembunyi)
  btnTema.addEventListener("click", (e) => {
    e.stopPropagation(); // Biar gak langsung ketrigger fungsi close di bawah
    menuAksesibilitas.classList.toggle("d-none");
  });

  // 2. Click Outside: Menutup modal otomatis kalau klik di luar kotak modal/tombol
  document.addEventListener("click", (e) => {
    if (!menuAksesibilitas.contains(e.target) && e.target !== btnTema) {
      menuAksesibilitas.classList.add("d-none");
    }
  });
}

// Jalankan fungsinya setelah navbar lu selesai nempel di DOM HTML
setTimeout(initAccessibilityModal, 100);
