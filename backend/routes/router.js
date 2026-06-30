// 1. Fungsi utamanya ditaruh di atas
let routerState = {};
function navigateTo(page) {
    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = "";

    switch (page) {
        case "dashboard":
            if (typeof renderDashboard !== 'undefined') {
                content.innerHTML = renderDashboard();
                if (typeof initDashboardListener !== 'undefined') initDashboardListener();
            } else {
                window.location.href = '/frontEnd/page/structure/dashboard.html';
            }
            break;
        case "input-siswa":
            if (typeof renderInputSiswa !== 'undefined') {
                content.innerHTML = renderInputSiswa();
                if (typeof initInputSiswaListener !== 'undefined') initInputSiswaListener();
            } else {
                // Karena inputStudent.js dimuat di dashboard.html, kita bisa redirect ke sana
                window.location.href = '/frontEnd/page/structure/dashboard.html';
            }
            break;
        case "detail-siswa":
            if (typeof renderDetailSiswa !== "undefined") {
                content.innerHTML = renderDetailSiswa();

                if (typeof initDetailSiswaListener !== "undefined") {
                    initDetailSiswaListener(routerState);
                }
            } else {
                window.location.href = '/frontEnd/page/structure/dashboard.html';
            }
            break;
        case "grafik":
        case "statistika":
            if (typeof renderGrafik !== 'undefined') {
                content.innerHTML = renderGrafik();
                if (typeof initDashboardListener !== 'undefined') initDashboardListener();
            } else {
                window.location.href = '/frontEnd/page/structure/statistika.html';
            }
            break;
        case "scan-rfid":
            if (typeof renderScanRfid !== 'undefined') {
                content.innerHTML = renderScanRfid();
                if (typeof initScanRfid !== 'undefined') initScanRfid();
            } else {
                window.location.href = '/frontEnd/page/structure/dashboard.html';
            }
            break;
        case "print":
            if (typeof renderPrint !== 'undefined') {
                content.innerHTML = renderPrint();
                if (typeof initPrint !== 'undefined') initPrint();
            } else {
                window.location.href = '/frontEnd/page/structure/dashboard.html';
            }
            break;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Sinkronisasi foto profil dari localStorage untuk semua halaman yang memuat router.js
    const savedImage = localStorage.getItem("profileImageBase64");
    if (savedImage) {
        const profileImg = document.getElementById("profileImage");
        if (profileImg) profileImg.src = savedImage;

        // Fallback untuk img profile yang mungkin tidak punya ID (di sidebar menu yang ada /profiles/)
        const sidebarImgs = document.querySelectorAll('.sidebar-menu img[src*="profiles"]');
        sidebarImgs.forEach(img => img.src = savedImage);
    }

    const path = window.location.pathname;
    if (path.includes("statistika")) {
        navigateTo("statistika");
    } else if (path.includes("input")) {
        navigateTo("input-siswa");
    } else {
        navigateTo("dashboard");
    }
});