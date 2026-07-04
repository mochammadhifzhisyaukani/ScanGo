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
    fetch(`http://localhost:3000/api/users/${nis}`, { credentials: "include" }).then((r) => r.json()),
    fetch(`http://localhost:3000/api/users/${nis}/attendances`, { credentials: "include" }).then((r) =>
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
          if (att.time_finish) {
            const ms = new Date(att.time_finish) - new Date(att.created_at);
            if (ms > 0) totalMenit += ms / 60000;
          } else if (att.status === "Hadir" || !att.status) {
            const ms = Date.now() - new Date(att.created_at);
            if (ms > 0) totalMenit += ms / 60000;
          }
        });
      }
      const totalDurasiLabel =
        totalMenit > 0
          ? `${Math.floor(totalMenit / 60)}j ${Math.round(totalMenit % 60)}m`
          : "-";

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

      function formatJam(dateStr) {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      }

      function hitungDurasi(masukStr, keluarStr) {
        if (!masukStr) return "-";
        const ms = keluarStr
          ? new Date(keluarStr) - new Date(masukStr)
          : Date.now() - new Date(masukStr);
        if (ms <= 0) return "-";
        const jam = Math.floor(ms / 3600000);
        const menit = Math.round((ms % 3600000) / 60000);
        return `${jam}j ${menit}m`;
      }

      const rows = dataTerbatas
        .map((att) => {
          const dt = new Date(att.created_at);
          const tanggal = dt.toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const jamMasuk = formatJam(att.created_at);
          const jamKeluar = formatJam(att.time_finish);
          const durasi = hitungDurasi(att.created_at, att.time_finish);
          const statusClass =
            att.status === "Hadir"
              ? "status-badge-hadir"
              : "status-badge-lainnya";

          return `
                <tr>
                    <td><strong>${tanggal}</strong></td>
                    <td><span class="jam-badge-masuk">${jamMasuk}</span></td>
                    <td><span class="jam-badge-keluar">${jamKeluar}</span></td>
                    <td>${durasi}</td>
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