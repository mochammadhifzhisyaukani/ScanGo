// 1. Fungsi utamanya ditaruh di atas
function navigateTo(page) {
    const content = document.getElementById("content");
    if (!content) return;

    content.innerHTML = "";

    switch (page) {
        case "dashboard":
            content.innerHTML = renderDashboard();
            initDashboardListener();
            break;
        case "input-siswa":
            content.innerHTML = renderInputSiswa();
            initInputSiswaListener();
            break;
    }
}

// 2. KODE PEMICU OTOMATIS INI DILETAKKAN DI BARIS PALING BAWAH FILE ROUTER.JS
document.addEventListener("DOMContentLoaded", function () {
    navigateTo("dashboard");
});