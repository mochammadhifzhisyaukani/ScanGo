const content = document.getElementById("content");

const listItems = [
// news
  {
    news: "5 Alasan Memilih Jurusan Kuliah Rekayasa Perangkat Lunak (RPL)", 
    deskription: "Jurusan Rekayasa Perangkat Lunak tentunya, dapat memasuki semua bidang industri kerja, karena tidak hanya membahas seputar software computer.",
    documentation: "https://smkwikrama.sch.id/storage/1683874518-berita$berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/5-alasan-memilih-jurusan-kuliah-rekayasa-perangkat-lunak-rpl",
    source: "SMK Wikrama Bogor",
  },
  {
    news: "Beberapa Cara Ini Dapat Membuat Laptopmu Terhindar Dari Virus Loh!!",
    deskription: "Jurusan Rekayasa Perangkat Lunak tentunya, dapat memasuki semua bidang industri kerja, karena tidak hanya membahas seputar software computer.",
    documentation: "https://smkwikrama.sch.id/storage/1683876599-berita$berita.jpg",
    date: "12 Mei 2023",
    link: "https://smkwikrama.sch.id/berita/5-alasan-memilih-jurusan-kuliah-rekayasa-perangkat-lunak-rpl",
    source: "SMK Wikrama Bogor",
  },







// update info
  {
    update: "ScanGo V1.1 Beta(rilis)", 
    documentationUpdate: "/src/assets/background/1695789061-post.jpg",
    dateUpdate: "15 Mei 2023",
    sourceUpdate: "Sukses Bersama Team",
  },
];

const renderMainGrid = (data) =>
  data
    .map(
      (item) => `
      <div class="col-12 col-md-6 mb-4">
        <div class="card main-grid-card" style="border: none !important;">
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
        <div class="card side-list-card-overlay" onclick="window.location.href='${item.link}'">
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
    <div class="container-sm" style="margin-top: 8%;">
        <div id="changeTheme" class="container-sm d-flex justify-content-center animate__animated animate__jackInTheBox" style="margin-top: 8%;"></div>
        <div class="d-flex justify-content-center mt-3">
            <a class="bg-light rounded-4 text-decoration-none text-black" style="padding: 10px;">Blog</a>
        </div>
        <div class="text-center">
            <h1>Discover our latest news</h1>
            <p>Explore news about the world of IT and also the development of this website</p>
        </div>
    </div>

    <div class="container my-5" style="margin-top: 5% !important;">
        <div class="row">
            
            <div class="col-lg-9">
                <h2 class="text-black mb-4 fw-bold">Digital Newspaper.</h2>
                <div id="main-grid-container" class="row"></div>
            </div>

            <div class="col-lg-3">
                <h4 class="text-black mb-4 fw-bold border-bottom pb-2" style="font-size: 1.25rem;">Updates Info</h4>
                <div id="side-list-container" class="row"></div>
            </div>

        </div>
    </div>
`;

const mainProducts = listItems.slice(0, 2);
const featuredProducts = listItems.slice(2);

document.getElementById("main-grid-container").innerHTML = renderMainGrid(mainProducts);
document.getElementById("side-list-container").innerHTML = renderSideList(featuredProducts);