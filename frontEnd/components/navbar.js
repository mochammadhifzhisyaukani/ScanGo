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
          <a class="nav-link text-center" href="#">Panduan</a>
          <a class="nav-link text-center" href="/frontend/page/structure/about.html">Tentang</a>
          <a class="nav-link text-center" href="/frontend/page/structure/company.html">Perusahaan</a>
        </div>

        <div class="d-flex justify-content-center gap-2">
          <button type="button" id="btnTema" class="nav-link text-center btn-theme px-4">Sesuaikan Tema</button>
        </div>

        <div id="menuAksesibilitas" class="accessibility-dropdown d-none animate__animated animate__fadeIn">
          <div id="changeTheme"></div>
          <div class="card">
            <div class="card-body d-flex" style="height: auto !important;">
              <input type="checkbox">
              <span class="ms-3">Terang</sp>
            </div>
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
