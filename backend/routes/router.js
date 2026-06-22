// 1. Fungsi utamanya ditaruh di atas
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
        case "grafik":
        case "statistika":
            if (typeof renderGrafik !== 'undefined') {
                content.innerHTML = renderGrafik();
                if (typeof initGrafikListerner !== 'undefined') initGrafikListerner();
            } else {
                window.location.href = '/frontEnd/page/structure/statistika.html';
            }
            break;
    }
}

// 2. KODE PEMICU OTOMATIS INI DILETAKKAN DI BARIS PALING BAWAH FILE ROUTER.JS
document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;
    if (path.includes("statistika")) {
        navigateTo("statistika");
    } else if (path.includes("input")) {
        navigateTo("input-siswa");
    } else {
        navigateTo("dashboard");
    }
});