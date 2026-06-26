const content = document.getElementById("content");

function profileDimas() {
  window.location.href = "https://www.linkedin.com/in/dimashadisyandana/";
}

function profileYazid() {
  window.location.href =
    "https://www.linkedin.com/in/yazid-diansyah-56aa62383/";
}

function profileHifzhi() {
  window.location.href =
    "https://www.linkedin.com/in/mochammad-hifzhiii-syaukani-872305386/";
}

content.innerHTML = `
    <div class="animate__animated animate__fadeInDown container w-100 bg-white rounded-4" style="background-color: var(--hero-about) !important; margin-top: 8%; padding: 20px;">
        <div class="container px-4">
          <div class="row gx-5">
            <div class="col-12 col-md-6">
              <div class="p-3" style="color: var(--color-teks);">
                <h1 class="mt-2" style="font-size: 50px;"><b>Wujudkan Pengelolaan Data yang Akurat Bersama ScanGo</b></h1>
                <p class="mt-5">
                    Pada era digital yang menuntut efisiensi tinggi, akurasi data and efektivitas waktu menjadi tolok ukur utama dalam keberhasilan pengelolaan administrasi lembaga pendidikan maupun instansi. Metode pencatatan kehadiran secara konvensional tidak hanya rentan terhadap kesalahan manusia (human error) dan manipulasi data, melainkan juga menyita waktu yang signifikan pada proses rekapitulasi.
                </p>
                <p>
                    ScanGo hadir sebagai jawaban mutakhir untuk mentransformasi sistem pengelolaan data civitas Anda. Melalui integrasi teknologi komputasi awan (cloud computing) dan ekosistem Internet untuk Segala (Internet of Things/IoT) terdepan, ScanGo offers sistem pemindaian kartu RFID yang responsif, aman, dan dapat diselesaikan dalam hitungan detik. Seluruh data yang terekam akan ditransmisikan secara seketika (real-time) ke server dengan jaminan stabilitas tinggi guna meminimalkan risiko kehilangan data.
                </p>
                <p>
                    Selain keunggulan pada aspek kecepatan perangkat keras, platform ini dirancang dengan antarmuka yang ramah pengguna. Anda dapat mengelola data pengguna, mengatur hak akses multiperan, hingga melakukan impor data massal dari format Excel secara instan tanpa kendala teknik.
                </p>
              </div>
            </div>
            
            <div class="col-12 col-md-6">
              <div class="p-3">
                <img src="/frontEnd/assets/background/1728261320-berita.jpg" class="rounded-4 mt-3" style="width: 100%;">
                <div class="container text-center" style="margin-top: 10%;">
                  <div class="row row-cols-2">
                    <div class="col">
                      <div class="card" style="border: none !important; background-color: #f8fafc;">
                        <div class="card-body">
                          <h3><b>500K+</b></h3>
                          <p>Total Pemindaian</p>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="card" style="border: none !important; background-color: #f8fafc;">
                        <div class="card-body">
                          <h3><b>1.5K+</b></h3>
                          <p>Perangkat Aktif</p>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="card mt-4" style="border: none !important; background-color: #f8fafc;">
                        <div class="card-body">
                          <h3><b>90%</b></h3>
                          <p>Dampak Nyata</p>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="card mt-4" style="border: none !important; background-color: #f8fafc;">
                        <div class="card-body">
                          <h3><b>V1.1</b> <button class="btn btn-success btn-sm">Beta</button></h3>
                          <p>Versi Update</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <div id="about-section"></div>

    <div class="container px-4 about" style="margin-top: 8%;">
        <div class="row gx-5 row-stretch">
            <div class="col-lg-6">
                <div class="p-3">
                    <div id="changeTheme" class="animate__animated animate__jackInTheBox" style="margin-top: 8%;"></div>
                    <h1 class="title reveal">
                        Merevolusi Kehadiran dengan Kecepatan & Efisiensi Digital.
                    </h1>
                    <p class="subtitle mt-4 reveal">
                        Lahir dari kebutuhan akan sistem absensi yang lebih transparan, 
                        ScanGo menghadirkan solusi pemindaian cerdas yang memangkas waktu 
                        administratif secara signifikan. Kami menggabungkan enkripsi data 
                        tingkat tinggi dengan antarmuka yang intuitif untuk memastikan 
                        setiap detik kehadiran tercatat secara akurat, aman, dan tanpa celah 
                        manipulasi.
                    </p>
                    <div class="card reveal" style="border: none; background: transparent;">
                        <div class="d-flex card-body align-items-center px-0">
                            <img src="/frontEnd/assets/icons/realtime-icon.png" style="height: 50px; border-radius: 15px;">
                            <div class="ms-4">
                                <b style="font-size: 1.1rem; color: var(--color-teks);">Sinkronisasi Data Waktu secara Nyata</b><br>
                                <p class="mb-0" style="color: var(--color-teks);">Pantau kehadiran dan laporan harian secara langsung.</p>
                            </div>
                        </div>
                    </div>
                    <div class="card reveal" style="border: none; background: transparent;">
                        <div class="d-flex card-body align-items-center px-0">
                            <img src="/frontEnd/assets/icons/device-icon.png" style="height: 50px; border-radius: 15px;">
                            <div class="ms-4">
                                <b style="font-size: 1.1rem; color: var(--color-teks);">Integrasi Perangkat Instan</b><br>
                                <p class="mb-0" style="color: var(--color-teks);">Akses sistem absensi dari perangkat apa pun.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="p-3 h-100">
                    <img src="/frontend/assets/background/1684477396-post.jpg" class="img-fluid img-stretch shadow-sm reveal" alt="ScanGo Workspace">
                </div>
            </div>
        </div>

        <div id="dev"></div>

        <div class="container" style="margin-top: 8%;">
            <div class="mb-5">
                <h3 class="mt-2 title reveal title-dev" style="color: var(--color-teks);"><b>Mengenal Lebih Dekat Inovator di Balik ScanGo</b></h3>
                <p class="reveal" style="color: var(--color-teks);">Para pemikir kreatif di balik inovasi ScanGo.</p>
            </div>
            <div class="row g-4 justify-content-center">
                <div class="col-12 col-md-4 reveal">
                    <div class="card d-flex shadow-sm rounded-5 position-relative overflow-hidden" style="border: none; background-image: url('/frontEnd/assets/profiles/sampulProfileHifzhi.png'); background-size: cover; background-position: left center; background-repeat: no-repeat;">
                        <h6 class="ms-5 text-white" style="font-weight: 600; margin-bottom: 1px; margin-top: 110%;">Mochammad Hifzhi <span class="text-white">Syaukani</h6>
                        <p class="ms-5 mb-4" style="font-size: 14px; color: white;">Fullstack Development</p>
                        <a href="javascript:void(0)" onclick="profileHifzhi()" class="linkedin-icon-btn">
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>

                <div class="col-12 col-md-4 reveal">
                    <div class="card d-flex shadow-sm rounded-5 position-relative overflow-hidden" style="border: none; background-image: url('/frontEnd/assets/profiles/sampulProfileDimas.png'); background-size: cover; background-position: left center; background-repeat: no-repeat;">
                        <h6 class="ms-5" style="font-weight: 600; margin-bottom: 1px; margin-top: 110%;">Dimas Hadi Syandana</h6>
                        <p class="ms-5 mb-4" style="font-size: 14px; color: #6c757d;">Lead of Project</p>
                        <a href="javascript:void(0)" onclick="profileDimas()" class="linkedin-icon-btn">
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>

                <div class="col-12 col-md-4 reveal">
                    <div class="card d-flex shadow-sm rounded-5 position-relative overflow-hidden" style="border: none; background-image: url('/frontEnd/assets/profiles/sampulProfileYazid.png'); background-size: cover; background-position: left center; background-repeat: no-repeat;">
                        <h6 class="ms-5 text-white" style="font-weight: 600; margin-bottom: 1px; margin-top: 110%;">Yazid Diansyah</h6>
                        <p class="ms-5 mb-4" style="font-size: 14px; color: white;">UI/UX & Frontend</p>
                        <a href="javascript:void(0)" onclick="profileYazid()" class="linkedin-icon-btn">
                            <i class="bi bi-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
