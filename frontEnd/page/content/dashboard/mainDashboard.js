const content = document.getElementById("content");
content.innerHTML = `
    <div class="dashboard-container">
        <aside class="sidebar">
            <div class="sidebar-logo">
                <a href="/index.html">
                    <img src="/frontEnd/assets/logo/favicon.png" style="height: 30px;">
                </a>
            </div>
            <div class="sidebar-menu">
                <div class="menu-icon"><a href="/index.html" class="text-secondary"><i class="bi bi-house-door"></i></a></div>
                <div class="menu-icon">
                    <img src="/frontEnd/assets/profiles/dimas.png" style="height: 30px; border-radius: 50%;">
                </div>
                <div class="menu-icon active"><i class="bi bi-clock"></i></div>
                <div class="menu-icon"><i class="bi bi-upc-scan"></i></i></div>
                <div class="menu-icon"><i class="bi bi-bar-chart-line"></i></div>
                <div class="menu-icon"><a href="/frontEnd/page/structure/signUp.html"><i class="bi bi-person-fill-add"></i></a></div>
                <div class="menu-icon" style="margin-top: auto;"><i class="bi bi-gear"></i></div>
            </div>
        </aside>

        <main class="main-content">
            <div class="header-panel">
                <div class="header-title">
                    <h4>Monitoring Absensi</h4>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="header-nav-tabs justify-content-center mx-auto">
                        <a href="#" class="nav-tab-item active">Kelas X</a>
                        <a href="#" class="nav-tab-item">Kelas XI</a>
                        <a href="#" class="nav-tab-item">Kelas XII</a>
                    </div>
                    <div class="clock-date-wrapper">
                        <p id="time"></p>
                        <p id="date"></p>
                    </div>
                </div>
            </div>

            <div class="row g-3">
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="stat-card">
                        <div class="stat-label text-primary">
                            <i class="bi bi-check-circle-fill"></i>
                            <span>Total Siswa Hadir</span>
                        </div>
                        <div class="stat-value">120</div>
                        <div class="stat-indicator">
                            <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> 5%</span>
                            <span class="text-muted ms-1">from yesterday</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="stat-card">
                        <div class="stat-label text-info">
                            <i class="bi bi-clock-history"></i>
                            <span>Total Siswa Sakit</span>
                        </div>
                        <div class="stat-value">15</div>
                        <div class="stat-indicator">
                            <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> 3 people</span>
                            <span class="text-muted ms-1">compared to last week</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="stat-card">
                        <div class="stat-label text-danger">
                            <i class="bi bi-person-x-fill"></i>
                            <span>Total Siswa Tidak Hadir</span>
                        </div>
                        <div class="stat-value">8</div>
                        <div class="stat-indicator">
                            <span class="text-danger fw-semibold"><i class="bi bi-arrow-down-short"></i> 2 people</span>
                            <span class="text-muted ms-1">compared to last Monday</span>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-6 col-lg-3">
                    <div class="stat-card">
                        <div class="stat-label text-primary">
                            <i class="bi bi-stopwatch-fill"></i>
                            <span>Total Siswa Izin</span>
                        </div>
                        <div class="stat-value" style="font-size: 1.95rem;">25</div>
                        <div class="stat-indicator">
                            <span class="text-muted">Consistent with last week</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="data-card">
                <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div class="d-flex align-items-center gap-2">
                        <h5 class="fw-bold m-0" style="color: #1e293b; font-size: 1.05rem;">Riwayat Absensi</h5>
                    </div>
                    <div class="d-flex gap-2 flex-wrap align-items-center">
                        <select id="pilihanRombel" class="form-select form-select-sm bg-light border-0 text-muted rounded-3 " style="width: auto; height: 34px; font-size: 0.85rem;">
                            <option>Rombel</option>
                            <option value="1"><hr></option>
                            <option value="1">PPLG X-1</option>
                            <option value="1">PPLG X-2</option>
                            <option value="1">PPLG X-3</option>
                            <option value="1">PPLG X-4</option>
                            <option value="1">PPLG X-5</option>
                        </select>
                        <div class="btn btn-sm btn-light border-0 rounded-3 text-muted d-flex align-items-center gap-2 px-3" style="height: 34px; font-size: 0.85rem; line-height: 22px;">
                            <i class="bi bi-calendar3"></i> 14 Jun 2026
                        </div>
                        <div class="search-wrapper" style="height: 34px; background-color: #f8fafc; border: none;">
                            <i class="bi bi-search text-muted" style="font-size: 0.8rem;"></i>
                            <input type="text" placeholder="Search employee" style="width: 130px; background: transparent;">
                        </div>
                        <button class="btn-download d-flex align-items-center gap-2">
                            <i class="bi bi-download"></i> Download data <i class="bi bi-chevron-down ms-1" style="font-size: 0.7rem;"></i>
                        </button>
                    </div>
                </div>

                <div class="table-responsive">
                    <table class="table align-middle custom-table mb-0 w-100">
                        <thead>
                            <tr>
                                <th style="width: 10%;">Nis <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 25%;">Nama Siswa <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 25%;">Rombel <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 12%;">Jam Absen <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 12%;">Keterangan <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 12%;">Status <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                                <th style="width: 4%;">Aksi <i class="bi bi-chevron-expand ms-1 small text-muted"></i></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="text-muted">12510917</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <img src="/frontEnd/assets/profiles/dimas.png" class="avatar-img">
                                        <span class="fw-semibold" style="color: #1e293b;">Dimas Hadi Syandana</span>
                                    </div>
                                </td>
                                <td class="text-muted">PPLG X-3</td>
                                <td class="fw-semibold">08:15 AM</td>
                                <td class="text-muted">-</td>
                                <td><span class="status-badge status-present">Tepat Waktu</span></td>
                                <td class="text-end"><button class="btn btn-link text-muted p-0 border-0 bg-transparent"><i class="bi bi-three-dots"></i></button></td>
                            </tr>
                            <tr>
                                <td class="text-muted">12510916</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <img src="/frontEnd/assets/profiles/hifzhi.jpeg" class="avatar-img">
                                        <span class="fw-semibold" style="color: #1e293b;">Mochammad Hifzhi Syaukani</span>
                                    </div>
                                </td>3
                                <td class="text-muted">PPLG X-3</td>
                                <td class="fw-semibold">09:05 AM</td>
                                <td class="text-muted">Lupa bawa kartu</td>
                                <td><span class="status-badge status-late">Terlambat</span></td>
                                <td class="text-end"><button class="btn btn-link text-muted p-0 border-0 bg-transparent"><i class="bi bi-three-dots"></i></button></td>
                            </tr>
                            <tr>
                                <td class="text-muted">12510915</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <img src="/frontEnd/assets/profiles/yazid.jpeg" class="avatar-img">
                                        <span class="fw-semibold" style="color: #1e293b;">Yazid Diansyah</span>
                                    </div>
                                </td>
                                <td class="text-muted">PPLG X-2</td>
                                <td class="text-muted">-</td>
                                <td class="text-muted">-</td>
                                <td><span class="status-badge status-absent">Tidak Hadir</span></td>
                                <td class="text-end"><button class="btn btn-link text-muted p-0 border-0 bg-transparent"><i class="bi bi-three-dots"></i></button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    </div>
`;

function startRealTimeClockAndDate() {
  const timeElement = document.getElementById("time");
  const dateElement = document.getElementById("date");

  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  function updateClock() {
    const now = new Date();

    let hours = now.getHours().toString().padStart(2, "0");
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let seconds = now.getSeconds().toString().padStart(2, "0");

    let localDate = now.toLocaleDateString("id-ID", dateOptions);

    if (timeElement) {
      timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    }
    if (dateElement) {
      dateElement.innerHTML = `${localDate}`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

startRealTimeClockAndDate();
