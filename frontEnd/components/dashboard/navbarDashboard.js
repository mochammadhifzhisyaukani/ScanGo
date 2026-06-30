const navbarDashboard = document.getElementById("navbarDashboard");
navbarDashboard.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4 px-2">
        <div class="d-flex align-items-center gap-3">
            <button id="hamburgerBtn" class="btn btn-light border rounded-3 p-2 d-flex align-items-center justify-content-center" style="width:36px; height:36px;">
                <i class="bi bi-list fs-5" id="hamburgerIcon"></i>
            </button>
            <h4 class="fw-bold m-0" style="color: #1e293b;">Dashboard</h4>
        </div>
        <div class="d-flex align-items-center gap-3">
            <div class="bg-white rounded-pill px-3 py-1 d-flex gap-3 shadow-sm border" style="font-size: 0.85rem;">
                <a href="#" class="text-primary text-decoration-none fw-semibold">Clock-In/Out</a>
                <a href="#" class="text-secondary text-decoration-none">Leave Management</a>
                <a href="#" class="text-secondary text-decoration-none">Working Hours</a>
            </div>
            <button class="btn btn-link text-secondary position-relative p-1">
                <i class="bi bi-bell fs-5"></i>
            </button>
            <div class="d-flex align-items-center gap-2">
                <div class="bg-light border rounded-3 px-2 py-1 d-flex align-items-center gap-2">
                    <i class="bi bi-search text-muted" style="font-size: 0.85rem;"></i>
                    <input type="text" placeholder="Search something" class="border-0 bg-transparent" style="outline: none; font-size: 0.85rem; width: 120px;">
                </div>
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" class="rounded-circle border" width="35px" height="35px">
            </div>
        </div>
    </div>
`;


// Deklarasi sekali saja setelah innerHTML di-set
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sidebar = document.querySelector(".sidebar");

hamburgerBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
});