function navigateTo(page) {
    const content = document.getElementById("content");
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
    
        default:
            break;
    }
}