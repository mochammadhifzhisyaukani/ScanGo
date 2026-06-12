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
    <section class="hero-section animate__animated animate__fadeInDown">
        <div class="text-center">
            <h1 class="title animate__animated animate__zoomInDown text-white" style="margin-top: 8%; font-size: 70px;">Building an Efficient <br> Digital Attendance</h1>
            <p class="animate__animated animate__fadeInUp text-white">Transforming traditional tracking into a seamless digital experience for modern institutions.</p>

            <div class="whyShould" style="margin-top: 15%;">
                <a href="#about-section" class="text-white animate__animated animate__fadeInDown text-decoration-none text-white" style="letter-spacing: 5px;">
                    Why Should ScanGo?
                </a>
            </div>

            <div class="container-sm hr-about" style="margin-top: 10%; border-bottom: 2px solid white;"></div>
        </div>
    </section>

    <div id="about-section"></div>

    <div class="container px-4 about" style="margin-top: 10%;">
        <div class="row gx-5 row-stretch">
            <div class="col-lg-6">
                <div class="p-3">
                    <div id="changeTheme" class="animate__animated animate__jackInTheBox" style="margin-top: 8%;"></div>
                    <button class="badge reveal mt-3">ABOUT US</button>
                    <h1 class="mt-2 title reveal">
                        Revolutionizing Presence with Digital Speed & Efficiency.
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
                                <b style="font-size: 1.1rem; color: var(--color-teks);">Real-Time Data Synchronization</b><br>
                                <p class="mb-0" style="color: var(--color-teks);">Pantau kehadiran dan laporan harian secara langsung.</p>
                            </div>
                        </div>
                    </div>

                    <div class="card reveal" style="border: none; background: transparent;">
                        <div class="d-flex card-body align-items-center px-0">
                            <img src="/frontEnd/assets/icons/device-icon.png" style="height: 50px; border-radius: 15px;">
                            <div class="ms-4">
                                <b style="font-size: 1.1rem; color: var(--color-teks);">Instant Device Integration</b><br>
                                <p class="mb-0" style="color: var(--color-teks);">Akses sistem absensi dari perangkat apa pun.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-lg-6">
                <div class="p-3 h-100">
                    <img src="/frontEnd/assets/background/1684477396-post.jpg" 
                         class="img-fluid img-stretch shadow-sm reveal" 
                         alt="ScanGo Workspace">
                </div>
            </div>
        </div>

        <div id="dev"></div>

        <div class="container-sm" style="margin-top: 8%;">

            <div class="text-center mb-5">
                <button class="badge reveal badge-dev">DEVELOPER</button>
                <h1 class="mt-2 title reveal title-dev" style="color: var(--color-teks);">See Who Made It</h1>
                <p class="reveal" style="color: var(--color-teks);">The creative minds behind ScanGo innovation.</p>
            </div>

            <div class="row g-4 justify-content-center">
                <div class="col-md-4 reveal">
                    <div class="card shadow-sm text-center" style="border-radius: 35px; border: 1px solid rgba(255, 255, 255, 0.7); background: linear-gradient(180deg, #ffde59 0%, #ffffff 100%); padding: 25px;">
                        <img src="/frontEnd/assets/profiles/hifzhi.jpeg" class="mx-auto mb-3" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid white;">
                        <h6 style="font-weight: 600; margin-bottom: 5px;">Muhammad Hifzhi Syaukani</h6>
                        <p style="font-size: 14px; color: #6c757d;">Fullstack Development</p>
                        <button class="btn btn-profile btn-sm mt-2" onclick="profileHifzhi()" style="background: white; border-radius: 15px; border: 1px solid #eee; font-weight: 500; font-size: 12px; padding: 5px 20px;">Profile</button>
                    </div>
                </div>

                <div class="col-md-4 reveal">
                    <div class="card shadow-sm text-center" style="border-radius: 35px; border: 1px solid rgba(255, 255, 255, 0.7); background: linear-gradient(180deg, #ffde59 0%, #ffffff 100%); padding: 25px;">
                        <img src="/frontEnd/assets/profiles/dimas.png" class="mx-auto mb-3" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid white;">
                        <h6 style="font-weight: 600; margin-bottom: 5px;">Dimas Hadi Syandana</h6>
                        <p style="font-size: 14px; color: #6c757d;">Lead of Project</p>
                        <button class="btn btn-profile btn-sm mt-2" onclick="profileDimas()" style="background: white; border-radius: 15px; border: 1px solid #eee; font-weight: 500; font-size: 12px; padding: 5px 20px;">Profile</button>
                    </div>
                </div>

                <div class="col-md-4 reveal">
                    <div class="card shadow-sm text-center" style="border-radius: 35px; border: 1px solid rgba(255, 255, 255, 0.7); background: linear-gradient(180deg, #ffde59 0%, #ffffff 100%); padding: 25px;">
                        <img src="/frontEnd/assets/profiles/yazid.jpeg" class="mx-auto mb-3" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid white;">
                        <h6 style="font-weight: 600; margin-bottom: 5px;">Yazid Diansyah</h6>
                        <p style="font-size: 14px; color: #6c757d;">Fullstack Develepment</p>
                        <button class="btn btn-profile btn-sm mt-2" onclick="profileYazid()" style="background: white; border-radius: 15px; border: 1px solid #eee; font-weight: 500; font-size: 12px; padding: 5px 20px;">Profile</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
`;
