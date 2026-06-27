function renderDashboard() {
  return `
    <div class="dashboard-container animate__animated animate__fadeIn">
        <div class="main-wrapper mt-4" style="flex: 1; display: flex; flex-direction: column;">
            <main class="main-content" style="padding: 20px; overflow-y: auto;">
                
                <div id="content"></div>

            </main>
        </div>
    </div>
`;
}

let clockInterval = null;
let currentSelectedClass = "X";
let currentSelectedRombel = null;

async function initDashboardListener() {
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

    if (timeElement) timeElement.innerHTML = `${hours}:${minutes}:${seconds}`;
    if (dateElement) dateElement.innerHTML = `${localDate}`;
  }

  if (typeof clockInterval !== "undefined" && clockInterval !== null) {
    clearInterval(clockInterval);
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  initTabs();
}

async function fetchAttendanceData() {
  try {
    const response = await fetch("http://localhost:3000/api/attendances", {
      method: "GET",
      headers: { "api-token": "12345" },
    });
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function generateKontenKelasTemplate(namaKelas, dataAbsensi) {
  let dataFiltered = dataAbsensi.filter((row) => {
    const rombel = String(row.rombel || "").toUpperCase();
    return rombel.includes(namaKelas.toUpperCase());
  });

  if (currentSelectedRombel && currentSelectedRombel !== "all") {
    dataFiltered = dataFiltered.filter((row) => {
      const rombelText = String(row.rombel || "");
      return (
        rombelText.endsWith(currentSelectedRombel) ||
        rombelText.includes(`-${currentSelectedRombel}`)
      );
    });
  }

  const totalHadir = dataFiltered.length;

  const tableRowsHtml =
    dataFiltered.length === 0
      ? `<tr><td colspan="7" class="text-center text-muted py-4">Belum ada riwayat tap kartu hari ini</td></tr>`
      : dataFiltered
          .map((row) => {
            const jamAbsen = row.created_at
              ? new Date(row.created_at).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            const namaSiswa = row.users
              ? Array.isArray(row.users)
                ? row.users[0]?.username
                : row.users.username
              : null;
            const displayNama = namaSiswa || row.idcard || "Tidak Dikenal";

            return `
                <tr>
                    <td class="text-muted">${row.id}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <span class="fw-semibold" style="color: var(--color-teks);">${displayNama}</span>
                        </div>
                    </td>
                    <td class="text-muted">${row.idcard}</td>
                    <td class="fw-semibold">${row.rombel || "-"}</td>
                    <td class="fw-semibold">${jamAbsen}</td>
                    <td class="text-muted">-</td>
                    <td><span class="status-badge status-present">${row.status || "Hadir"}</span></td>
                </tr>
            `;
          })
          .join("");

  return `
        <div class="row g-3 mb-4">
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-primary">
                        <i class="bi bi-check-circle-fill"></i>
                        <span>Total Siswa Hadir</span>
                    </div>
                    <div class="stat-value">${totalHadir}</div>
                    <div class="stat-indicator">
                        <span class="text-success fw-semibold"><i class="bi bi-arrow-up-short"></i> Live</span>
                        <span class="text-muted ms-1">dari database</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-info">
                        <i class="bi bi-clock-history"></i>
                        <span>Total Siswa Sakit</span>
                    </div>
                    <div class="stat-value">0</div>
                    <div class="stat-indicator">
                        <span class="text-muted">Data default</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-danger">
                        <i class="bi bi-person-x-fill"></i>
                        <span>Total Siswa Tidak Hadir</span>
                    </div>
                    <div class="stat-value">0</div>
                    <div class="stat-indicator">
                        <span class="text-muted">Data default</span>
                    </div>
                </div>
            </div>
            <div class="col-12 col-md-6 col-lg-3">
                <div class="stat-card">
                    <div class="stat-label text-primary">
                        <i class="bi bi-stopwatch-fill"></i>
                        <span>Total Siswa Izin</span>
                    </div>
                    <div class="stat-value" style="font-size: 1.95rem;">0</div>
                    <div class="stat-indicator">
                        <span class="text-muted">Data default</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="data-card">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                <div class="d-flex align-items-center gap-2">
                    <h5 class="fw-bold m-0" style="color: var(--color-teks); font-size: 1.05rem;">Riwayat Absensi Kelas ${namaKelas}</h5>
                </div>
                <div class="d-flex gap-2 flex-wrap align-items-center">
                    <select id="pilihanRombel" class="form-select form-select-sm bg-light border-0 text-muted rounded-3" style="width: auto; height: 34px; font-size: 0.85rem;">
                        <option>Rombel</option>
                        <option value="1">PPLG ${namaKelas}-1</option>
                        <option value="2">PPLG ${namaKelas}-2</option>
                    </select>
                    <div class="btn btn-sm btn-light border-0 rounded-3 text-muted d-flex align-items-center gap-2 px-3" style="height: 34px; font-size: 0.85rem; line-height: 22px;">
                        <i class="bi bi-calendar3"></i> Live Data
                    </div>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table align-middle custom-table mb-0 w-100">
                    <thead>
                        <tr>
                            <th style="width: 10%;">ID Log</th>
                            <th style="width: 15%;">Nama Lengkap</th>
                            <th style="width: 15%;">Id RFID</th>
                            <th style="width: 15%;">Rombel</th>
                            <th style="width: 12%;">Jam Absen</th>
                            <th style="width: 12%;">Keterangan</th>
                            <th style="width: 12%;">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function initTabs() {
  const tabs = document.querySelectorAll(".header-nav-tabs .nav-tab-item");
  const contentContainer = document.getElementById("content");

  if (contentContainer) {
    contentContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memuat data absensi...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    contentContainer.innerHTML = generateKontenKelasTemplate(
      currentSelectedClass,
      dataTerbaru,
    );
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", async function (e) {
      e.preventDefault();

      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      currentSelectedClass = this.getAttribute("data-kelas");

      if (contentContainer) {
        contentContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Memeriksa database...</p></div>`;
        const dataTerbaru = await fetchAttendanceData();
        contentContainer.innerHTML = generateKontenKelasTemplate(
          currentSelectedClass,
          dataTerbaru,
        );
      }
    });
  });
}

async function handleRombelFilter() {
  const selectElement = document.getElementById("pilihanRombel");
  if (!selectElement) return;
  currentSelectedRombel = selectElement.value;
  const contentContainer = document.getElementById("content");

  if (contentContainer) {
    contentContainer.innerHTML = `<div class="text-center p-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">Menyaring rombel...</p></div>`;
    const dataTerbaru = await fetchAttendanceData();
    contentContainer.innerHTML = generateKontenKelasTemplate(
        currentSelectedClass,
        dataTerbaru
    );
  }
}

async function editAttendancesStatus(id, currentStatus) {
    const statusBaru = prompt("Ubah status absensi (Hadir / Sakit / Izin / Alpa): ", currentStatus);
    if (statusBaru === null) return;

    const statusValid = ["Hadir", "Sakit", "Izin", "Alpa"];
    if (!statusValid.includes(statusBaru.trim())) {
        alert("Status tidak valid! Masukkan: Hadir, Sakit, Izin, atau Alpa");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/attendances/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "api-token": "123"
            },
            body: JSON.stringify({ status: statusBaru.trim() })
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert("Status absensi berhasil diperbarui!");
            initTabs();
        } else {
            alert("Gagal memperbarui status: " + (result.message || "Error server"));
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan koneksi saat memperbarui data");
    }
}

async function deleteAttendanceLog(id) {
    if (!confirm("Apakah anda yakin ingin menghapus data log absensi ini?")) return;

    try {
        const response = await fetch(`http://localhost:3000/api/attendances/${id}`, {
            method: "DELETE",
            headers: { "api-token": "123" }
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert("Log absensi berhasil dihapus!");
            initTabs();
        } else {
            alert("Gagal menghapus log: " + (result.message || "Error server"));
        }
    } catch (error) {
        console.error(error);
        alert("terjadi kesahalan koneksi saat menghapus data");
    }
}