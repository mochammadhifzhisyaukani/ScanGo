function renderDetailSiswa() {
  return `
        <div class="detail-siswa-wrapper">
            <!-- Kartu Profil Kiri -->
            <div class="detail-profile-card" id="profileCard">
                <div class="detail-avatar-wrapper">
                    <div class="detail-avatar" id="detailAvatar">?</div>
                </div>

                <div id="profileInfo">
                    <div style="text-align:center; color:#6c757d; padding: 20px 0;">Memuat data...</div>
                </div>

                <div class="detail-action-buttons">
                    <button id="btnBack" class="btn-detail-back">
                        <i class="bi bi-arrow-left"></i> Kembali
                    </button>
                </div>
            </div>

            <!-- Panel Riwayat Kanan -->
            <div class="detail-history-panel">
                <div class="detail-history-header">
                    <i class="bi bi-clock-history" style="color:#6c8cff;"></i>
                    Riwayat 15 Kunjungan Terakhir
                </div>
                <div id="historyContent">
                    <div style="text-align:center; color:#6c757d; padding: 30px 0;">Memuat riwayat...</div>
                </div>
            </div>
        </div>

        <style>
        </style>
    `;
}

function initDetailSiswaListener(routerState) {
  const btnBack = document.getElementById("btnBack");
  const btnEdit = document.getElementById("btnEditSiswa");

  btnBack.onclick = () => {
    if (typeof navigateTo === "function") navigateTo("input-siswa");
  };

  const nis = routerState?.nis;
  if (!nis) {
    document.getElementById("profileInfo").innerHTML = `
            <p style="color:red; text-align:center; font-size: 0.85rem;">NIS tidak ditemukan. Silakan kembali.</p>`;
    return;
  }

  Promise.all([
    fetch(`http://localhost:3000/api/users/${nis}`).then((r) => r.json()),
    fetch(`http://localhost:3000/api/users/${nis}/attendances`).then((r) =>
      r.json(),
    ),
  ])
    .then(([userData, historyData]) => {
      if (!userData.success || !userData.user) {
        document.getElementById("profileInfo").innerHTML =
          `<p style="color:red; text-align:center; font-size: 0.85rem;">${userData.error || "Data siswa tidak ditemukan"}</p>`;
        return;
      }

      const user = userData.user;
      const initial = (user.username || "?").charAt(0).toUpperCase();
      const roleLabel = user.role === "teacher" ? "Guru" : "Siswa";
      const totalKunjungan = historyData.success ? historyData.data.length : 0;

      document.getElementById("detailAvatar").textContent = initial;

      let totalMenit = 0;
      if (historyData.success && historyData.data.length > 0) {
        historyData.data.forEach((att) => {
          if (att.status === "Hadir" || !att.status) totalMenit += 480;
        });
      }
      const totalDurasiLabel =
        totalMenit > 0 ? `${Math.round(totalMenit / 60)} Jam` : "-";

      document.getElementById("profileInfo").innerHTML = `
            <div class="detail-name">${user.username}</div>
            <div class="detail-nis-code">NIS: ${user.nis}</div>
            <div class="detail-badges">
                <span class="badge-role">${roleLabel}</span>
                <span class="badge-status-aktif">Aktif</span>
            </div>
            <div class="detail-info-grid">
                <div class="detail-info-row">
                    <span class="detail-info-label">Kelas</span>
                    <span class="detail-info-value">${user.rombel ? user.rombel.replace("_", " PPLG ") : "-"}</span>
                </div>
                <div class="detail-info-row">
                    <span class="detail-info-label">Email</span>
                    <span class="detail-info-value" style="font-size:0.75rem; max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${user.email || "-"}</span>
                </div>
                <div class="detail-info-row">
                    <span class="detail-info-label">UID RFID</span>
                    <span class="detail-info-value rfid-badge">${user.idcard || "-"}</span>
                </div>
            </div>
            <div class="detail-stats-row">
                <div class="detail-stat-box">
                    <div class="detail-stat-number">${totalKunjungan}</div>
                    <div class="detail-stat-label">Total Absen</div>
                </div>
                <div class="detail-stat-box">
                    <div class="detail-stat-number">${totalDurasiLabel}</div>
                    <div class="detail-stat-label">Total Durasi</div>
                </div>
            </div>
        `;

      const historyEl = document.getElementById("historyContent");
      if (!historyData.success || historyData.data.length === 0) {
        historyEl.innerHTML = `
                <div class="detail-empty-history">
                    <i class="bi bi-calendar-x" style="font-size:1.8rem; display:block; margin-bottom:6px;"></i>
                    Belum ada riwayat absensi.
                </div>`;
        return;
      }

      const dataTerbatas = historyData.data.slice(0, 15);

      const rows = dataTerbatas
        .map((att) => {
          const dt = new Date(att.created_at);
          const tanggal = dt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const jamMasuk = dt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          });
          const statusClass =
            att.status === "Hadir"
              ? "status-badge-hadir"
              : "status-badge-lainnya";

          return `
                <tr>
                    <td><strong>${tanggal}</strong></td>
                    <td><span class="jam-badge-masuk">${jamMasuk}</span></td>
                    <td><span class="jam-badge-keluar">15:30</span></td>
                    <td>8 Jam</td>
                    <td><span class="${statusClass}">${att.status || "Hadir"}</span></td>
                </tr>
            `;
        })
        .join("");

      historyEl.innerHTML = `
            <table class="detail-history-table">
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Jam Masuk</th>
                        <th>Jam Keluar</th>
                        <th>Durasi</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        `;
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("profileInfo").innerHTML =
        `<p style="color:red; text-align:center; font-size: 0.85rem;">Gagal memuat data: ${err.message}</p>`;
    });
}