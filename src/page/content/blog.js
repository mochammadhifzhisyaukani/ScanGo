const content = document.getElementById("content");

const listItems = [
  // news
  {
    news: "5 Alasan Memilih Jurusan Kuliah Rekayasa Perangkat Lunak (RPL)",
    documentation:
      "https://smkwikrama.sch.id/storage/1683874518-berita$berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/5-alasan-memilih-jurusan-kuliah-rekayasa-perangkat-lunak-rpl",
    source: "SMK Wikrama Bogor",
  },
  {
    news: "Beberapa Cara Ini Dapat Membuat Laptopmu Terhindar Dari Virus Loh!!",
    documentation:
      "https://smkwikrama.sch.id/storage/1683876599-berita$berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/5-alasan-memilih-jurusan-kuliah-rekayasa-perangkat-lunak-rpl",
    source: "SMK Wikrama Bogor",
  },
  {
    news: "8 Cara Belajar Pemrograman yang Efektif untuk Pemula",
    documentation: "https://smkwikrama.sch.id/storage/1690181153-berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/8-cara-belajar-pemrograman-yang-efektif-untuk-pemula",
    source: "SMK Wikrama Bogor",
  },
  {
    news: "Apa Itu Programer ? Hal-Hal Yang Wajib Dipelajari",
    documentation: "https://smkwikrama.sch.id/storage/1690516515-berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/apa-itu-programer-hal-hal-yang-wajib-dipelajari",
    source: "SMK Wikrama Bogor",
  },




  // update info
  {
    update: "ScanGo V1.1 Beta(rilis)",
    documentationUpdate: "/src/assets/background/1695789061-post.jpg",
    dateUpdate: "15 Mei 2023",
    sourceUpdate: "Sukses Bersama Team",
    linkUpdate: '#',
  },
];

const renderMainGrid = (data) =>
  data
    .map(
      (item) => `
      <div class="col-12 col-md-6 mb-4 reveal">
        <div class="card main-grid-card animate__animated animate__fadeIn" style="border: none !important;">
            <img src="${item.documentation}" alt="${item.news}">
            <div class="card-overlay-content mt-3">
                <div class="d-flex">
                    <div class="justify-content-start">
                        <span class="badge-category">${item.source}</span>
                    </div>
                    <div class="justify-content-end ms-auto">
                        <p class="text-black-50 small mb-0">${item.date}</p>
                    </div>
                </div>
                <h5 class="fw-bold m-0 text-truncate-2 mt-2" style="font-size: 1.1rem; line-height: 1.4;">${item.news}</h5>
                <button class="btn btn-warning rounded-3 mt-3 text-light" onclick="window.location.href='${item.link}'">Lihat Berita -></button>
            </div>
        </div>
      </div>
  `,
    )
    .join("");

const renderSideList = (data) =>
  data
    .map(
      (item) => `
    <div class="col-12 mb-3">
        <div class="card side-list-card-overlay animate__animated animate__fadeIn" onclick="window.location.href='${item.linkUpdate}'">
            <img src="${item.documentationUpdate}" alt="${item.update}">
            <div class="side-list-text-container">
                <span class="badge-category">${item.sourceUpdate}</span>
                <h6 class="title-text-mini">${item.update}</h6>
                <span class="text-white-50 small" style="font-size: 0.75rem;">${item.dateUpdate}</span>
            </div>
        </div>
    </div>
  `,
    )
    .join("");

content.innerHTML = `
    <div class="container-sm blog-header-container">
        <div id="changeTheme" class="btn-changeTheme container-sm d-flex justify-content-center animate__animated animate__jackInTheBox" style="margin-top: 8%;"></div>
        <div class="d-flex justify-content-center mt-3">
            <a class="bg-light rounded-4 text-decoration-none text-black animate__animated animate__fadeIn" style="padding: 10px;">Blog</a>
        </div>
        <div class="text-center">
            <h1 class="animate__animated animate__backInDown">Discover our latest news</h1>
            <p class="animate__animated animate__backInUp">Explore news about the world of IT and also the development of this website</p>
        </div>
    </div>

    <div class="container my-5" style="margin-top: 5% !important;">
        <div class="row">
            
            <div class="col-lg-9">
                <h2 class="text-black mb-4 fw-bold animate__animated animate__fadeInLeft" style="color: var(--color-teks) !important;">Digital Newspaper.</h2>
                <div id="main-grid-container" class="row"></div>
            </div>

            <div class="col-lg-3">
                <h4 class="text-black mb-4 fw-bold border-bottom pb-2 animate__animated animate__fadeInRight" style="font-size: 1.25rem; color: var(--color-teks) !important;">Updates Info</h4>
                <div id="side-list-container" class="row"></div>
            </div>

        </div>
    </div>
`;

const mainProducts = listItems.slice(0, 4);
const featuredProducts = listItems.slice(4);

document.getElementById("main-grid-container").innerHTML =
  renderMainGrid(mainProducts);
document.getElementById("side-list-container").innerHTML =
  renderSideList(featuredProducts);
