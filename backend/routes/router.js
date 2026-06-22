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
        case "scan-rfid":
            content.innerHTML = renderScanRfid();
            initScanRfid();
            break;
    }
}

document.addEventListener("DOMContentLoaded", function () {
    navigateTo("dashboard");
});