let content = document.getElementById("content");
content.innerHTML = `
    <div class="container-sm">
        <h1 class="title-index text-white animate__animated animate__fadeInDown">
            Revolusi Absensi<br>
            Siswa Jadi Lebih<br>
            Mudah & Cepat.
        </h1>

        <p class="text-white subtitle-index animate__animated animate__fadeInDown">
            Sistem manajemen kehadiran modern berbasis QR Code 
            untuk efisiensi waktu belajar mengajar di sekolah Anda.
        </p>

        <div class="d-flex mt-5 gap-3 animate__animated animate__fadeIn">
            <button type="button" onclick="btnGetStarted()" class="btn btn-lg btn-started">Get Started</button>
            <button class="btn btn-lg btn-watch">Watch Demo</button>

            <button onlick="btn-copyLink" class="btn btn-light rounded-circle btn-copyLink">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-link-45deg" viewBox="0 0 16 16">
                <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z"/>
                <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z"/>
                </svg>
            </button>
        </div>

        <a href="/frontend/page/structure/about.html#dev" class="d-flex gap-2 mt-4 animate__animated animate__fadeInUp text-decoration-none">
            <img src="/frontend/assets/profiles/dimas.png" alt="Profile Dev" class="img-profile-dev">
            <img src="/frontend/assets/profiles/hifzhi.jpeg" alt="Profile Dev" class="img-profile-dev">
            <img src="/frontend/assets/profiles/yazid.jpeg" alt="Profile Dev" class="img-profile-dev">
            <p class="text-white dev-text">
                See Developer Profile
            </p>
        </a>
    </div>

        <section class="tech-stack-section">
        <div class="swiper mySwiper">
            <div class="swiper-wrapper">

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/bootstrap.png" alt="Bootstrap">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/nodejs.png" alt="NodeJS">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/postgree.png" alt="PostgreSQL">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/swipper.png" alt="Swiper">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/expressjs.png" alt="ExpressJS">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/animate.png" alt="Animate CSS">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/sweetalert.png" alt="SweetAlert">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card mt-3">
                        <img src="/frontEnd/assets/logo/partners/techStack/supabase.png" alt="Supabase">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/github.png" alt="Github">
                    </div>
                </div>

                <div class="swiper-slide">
                    <div class="logo-card">
                        <img src="/frontEnd/assets/logo/partners/techStack/vercel.png" alt="Vercel">
                    </div>
                </div>



            </div>
        </div>
    </section>
`;

function btnGetStarted() {
    window.location.href = "/frontEnd/page/structure/signIn.html";
}

const swiperEl = document.querySelector('.mySwiper');

swiperEl.addEventListener('mouseenter', () => {
    swiper.autoplay.stop();
});

swiperEl.addEventListener('mouseleave', () => {
    swiper.autoplay.start();
});

const swiper = new Swiper('.mySwiper', {
    loop: true,
    allowTouchMove: false,

    autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },

    speed: 4000,

    breakpoints: {
        320: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 3,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 5,
            spaceBetween: 40
        }
    }
});

