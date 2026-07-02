const content = document.getElementById("content");

content.innerHTML = `
    <div class="container-sm hero-company animate__animated animate__fadeInDown w-100 bg-white" style="border-radius: 20px 40px 20px 40px; margin-top: 8%; background-image: url('/frontEnd/assets/background/1704346349-slider$slider.jpg'); padding: 50px; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
      <div class="container px-4">
        <div class="row align-items-center gy-4">
          <div class="col-12 col-md-6">
            <div class="p-3">
              <span class="text-uppercase fw-bold text-white" style="letter-spacing: 2px; font-size: 14px;">We Are</span>
              <h1 class="text-white"><b>SUKSES BERSAMA TEAM</b></h1>
              <p class="text-secondary mt-4 text-white" style="font-size: 18px;">"Start Together, Grow Together!"</p>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="p-3 d-flex">
              <img src="/frontEnd/assets/logo/logoTeam.png" style="height: 200px; margin-right: 50px;" class="justify-content-end ms-auto">
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container my-5">
      <div class="row g-3 align-items-stretch"> 
        <div class="col-12 col-md-6 animate__animated animate__zoomInLeft">
          <div class="ratio ratio-1x1 h-100">
            <img src="/frontend/assets/images/WhatsApp Image 2026-05-11 at 22.05.50.jpeg" class="img-fluid rounded-4 object-fit-cover leftBig-img" alt="Scan & Go System">
          </div>
        </div>
        <div class="col-12 col-md-6">
          <div class="row g-3 h-100">
            <div class="col-12 h-50 animate__animated animate__bounceInRight">
              <div class="ratio ratio-16x9 h-100">
                <img src="/frontend/assets/images/WhatsApp Image 2026-06-22 at 11.09.51.jpeg" class="img-fluid rounded-4 object-fit-cover rightSmall-img" alt="Modern Attendance">
              </div>
            </div>
            <div class="col-12 h-50 animate__animated animate__bounceInLeft">
              <div class="ratio ratio-16x9 h-100">
                <img src="/frontend/assets/images/WhatsApp Image 2026-05-11 at 22.05.523.jpeg" class="img-fluid rounded-4 object-fit-cover rightSmall-img" alt="Barcode Detection">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="title reveal" style="margin-top: 8%;">
        <h1 class="text-center animate__animated animate__fadeInDown" style="color: var(--color-teks);">
            Kami Bangga dalam Memberikan Hasil yang Luar Biasa
        </h1>
        <p class="text-center animate__animated animate__fadeInDown" style="color: var(--color-teks);">
            Berawal dari sebuah ide dan pemikiran sederhana, menjadi solusi dan jalan pintas menghadapi setiap masalah.
        </p>

        <div class="container" style="margin-top: 50px;">
  <div class="row">
    <div class="col">
      <div class="card rounded-5" style="padding: 20px; background: var(--bg-sidebar); height: 500px; border: none !important; color: var(--color-teks); width: 100%;">
  <img src="/frontEnd/assets/mascot/bertanya-tanya.png" class="card-img-top" alt="...">
  <div class="card-body">
    <h5 class="card-title"><b>ScanGo</b></h5>
    <p class="card-text">Absensi Digital</p>
  </div>
</div>
    </div>
    <div class="col">
        <div class="card d-flex align-items-center justify-content-center text-center rounded-5" style="width: 100%; background-color: var(--bg-sidebar); padding: 20px; height: 500px; color: var(--color-teks); border: none !important;">  
            <h5>Projek Belum tersedia</h5>
        </div>
    </div>
    <div class="col">
        <div class="card d-flex align-items-center justify-content-center text-center rounded-5" style="width: 100%; background-color: var(--bg-sidebar); padding: 20px; height: 500px; color: var(--color-teks); border: none !important;">  
            <h5>Projek Belum tersedia</h5>
        </div>
    </div>
    </div>
    </div>

    <div class="text-center" style="margin-top: 5%;">
      <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" style="color: var(--color-teks);" class="bi bi-quote animate__animated animate__fadeInDown reveal" viewBox="0 0 16 16">
        <path d="M12 12a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1h-1.388q0-.527.062-1.054.093-.558.31-.992t.559-.683q.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 9 7.558V11a1 1 0 0 0 1 1zm-6 0a1 1 0 0 0 1-1V8.558a1 1 0 0 0-1-1H4.612q0-.527.062-1.054.094-.558.31-.992.217-.434.559-.683.34-.279.868-.279V3q-.868 0-1.52.372a3.3 3.3 0 0 0-1.085.992 4.9 4.9 0 0 0-.62 1.458A7.7 7.7 0 0 0 3 7.558V11a1 1 0 0 0 1 1z"/>
      </svg>
      <h4 class="container-sm quote reveal" style="color: var(--color-teks);">
        "Absensi bukan sekadar mencatat kehadiran, tapi tentang membangun budaya disiplin yang transparan. Dengan sistem ScanGo, kami memangkas waktu dan menghilangkan lelah nya berteriak dikala absensi demi efisiensi operasional yang maksimal."
      </h4>
      <div class="d-flex gap-2 justify-content-center mt-5">
        <img src="/frontend/assets/profiles/dimas.png" alt="profile dev" class="profile-dev reveal" style="border-radius: 50%; height: 50px;">
        <p class="position-dimas reveal" style="color: var(--color-teks);"><b>Dimas Hadi Syandana</b><br> Lead Developer of ScanGo</p>
      </div>
    </div>
`;