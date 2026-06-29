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
                    <button id="btnEditSiswa" class="btn-detail-edit" style="display:none;">
                        <i class="bi bi-pencil-square"></i> Edit Data
                    </button>
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
            .detail-siswa-wrapper {
                display: flex;
                gap: 24px;
                align-items: flex-start;
                padding: 4px 0;
                flex-wrap: wrap;
            }

            /* === KARTU PROFIL KIRI === */
            .detail-profile-card {
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                padding: 28px 24px 20px;
                min-width: 260px;
                max-width: 300px;
                flex-shrink: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0;
            }

            .detail-avatar-wrapper {
                margin-bottom: 14px;
            }

            .detail-avatar {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: #e8eaff;
                color: #5c6bc0;
                font-size: 2.2rem;
                font-weight: 700;
                display: flex;
                align-items: center;
                justify-content: center;
                text-transform: uppercase;
            }

            .detail-name {
                font-size: 1.2rem;
                font-weight: 700;
                color: #1a1a2e;
                text-align: center;
                margin-bottom: 4px;
            }

            .detail-nis-code {
                font-size: 0.82rem;
                color: #6c757d;
                text-align: center;
                margin-bottom: 10px;
            }

            .detail-badges {
                display: flex;
                gap: 6px;
                justify-content: center;
                margin-bottom: 20px;
            }

            .badge-role {
                background: #e8eaff;
                color: #5c6bc0;
                font-size: 0.75rem;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
            }

            .badge-status-aktif {
                background: #e8f8ef;
                color: #2ecc71;
                font-size: 0.75rem;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
            }

            .detail-info-grid {
                width: 100%;
                border-top: 1px solid #f0f0f0;
                padding-top: 16px;
                margin-bottom: 16px;
            }

            .detail-info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px 0;
                border-bottom: 1px solid #f7f7f7;
            }

            .detail-info-label {
                font-size: 0.82rem;
                color: #8a94a6;
                font-weight: 500;
            }

            .detail-info-value {
                font-size: 0.88rem;
                font-weight: 600;
                color: #2c3e50;
            }

            .detail-info-value.rfid-badge {
                background: #eef2ff;
                color: #5c6bc0;
                padding: 2px 8px;
                border-radius: 6px;
                font-family: monospace;
                font-size: 0.8rem;
            }

            .detail-stats-row {
                display: flex;
                gap: 12px;
                width: 100%;
                margin-bottom: 18px;
            }

            .detail-stat-box {
                flex: 1;
                background: #f8f9fc;
                border-radius: 10px;
                padding: 12px 8px;
                text-align: center;
            }

            .detail-stat-number {
                font-size: 1.5rem;
                font-weight: 700;
                color: #2c3e50;
                line-height: 1;
            }

            .detail-stat-label {
                font-size: 0.7rem;
                color: #8a94a6;
                margin-top: 4px;
                font-weight: 500;
            }

            .detail-action-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
            }

            .btn-detail-edit {
                width: 100%;
                padding: 10px;
                background: #f5a623;
                color: #fff;
                border: none;
                border-radius: 10px;
                font-size: 0.88rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }

            .btn-detail-edit:hover { background: #e0941a; }

            .btn-detail-back {
                width: 100%;
                padding: 10px;
                background: #f0f2f5;
                color: #555;
                border: none;
                border-radius: 10px;
                font-size: 0.88rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.2s;
            }

            .btn-detail-back:hover { background: #e2e6ea; }

            /* === PANEL RIWAYAT KANAN === */
            .detail-history-panel {
                background: #fff;
                border-radius: 16px;
                box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                padding: 24px;
                flex: 1;
                min-width: 300px;
            }

            .detail-history-header {
                font-size: 1rem;
                font-weight: 700;
                color: #1a1a2e;
                margin-bottom: 18px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .detail-history-table {
                width: 100%;
                border-collapse: collapse;
            }

            .detail-history-table thead th {
                font-size: 0.75rem;
                font-weight: 700;
                color: #8a94a6;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                padding: 8px 10px;
                border-bottom: 2px solid #f0f0f0;
                text-align: left;
            }

            .detail-history-table tbody td {
                font-size: 0.82rem;
                color: #2c3e50;
                padding: 10px 10px;
                border-bottom: 1px solid #f7f7f7;
                vertical-align: middle;
            }

            .detail-history-table tbody tr:last-child td {
                border-bottom: none;
            }

            .jam-badge-masuk {
                display: inline-block;
                background: #e8f8ef;
                color: #2ecc71;
                font-size: 0.78rem;
                font-weight: 600;
                padding: 3px 8px;
                border-radius: 6px;
                font-family: monospace;
            }

            .jam-badge-keluar {
                display: inline-block;
                background: #fef0e8;
                color: #e67e22;
                font-size: 0.78rem;
                font-weight: 600;
                padding: 3px 8px;
                border-radius: 6px;
                font-family: monospace;
            }

            .status-badge-hadir {
                display: inline-block;
                background: #e8f8ef;
                color: #2ecc71;
                font-size: 0.75rem;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
            }

            .status-badge-lainnya {
                display: inline-block;
                background: #f0f2f5;
                color: #6c757d;
                font-size: 0.75rem;
                font-weight: 600;
                padding: 3px 10px;
                border-radius: 20px;
            }

            .detail-empty-history {
                text-align: center;
                color: #adb5bd;
                padding: 40px 0;
                font-size: 0.88rem;
            }

            @media (max-width: 768px) {
                .detail-siswa-wrapper { flex-direction: column; }
                .detail-profile-card { max-width: 100%; width: 100%; }
            }
        </style>
    `;
}

function initDetailSiswaListener(routerState) {
    const btnBack = document.getElementById("btnBack");
    const btnEdit = document.getElementById("btnEditSiswa");

    // Tombol kembali
    btnBack.onclick = () => navigateTo("input-siswa");

    // Ambil NIS dari routerState
    const nis = routerState?.nis;
    if (!nis) {
        document.getElementById("profileInfo").innerHTML = `
            <p style="color:red; text-align:center;">NIS tidak ditemukan. Silakan kembali dan coba lagi.</p>`;
        return;
    }

    // Fetch data siswa dan riwayat absensi secara paralel
    Promise.all([
        fetch(`http://localhost:3000/api/users/${nis}`).then(r => r.json()),
        fetch(`http://localhost:3000/api/users/${nis}/attendances`).then(r => r.json())
    ])
    .then(([userData, historyData]) => {
        // === RENDER PROFIL ===
        if (!userData.success || !userData.user) {
            document.getElementById("profileInfo").innerHTML =
                `<p style="color:red; text-align:center;">${userData.error || "Data siswa tidak ditemukan"}</p>`;
            return;
        }

        const user = userData.user;
        const initial = (user.username || "?").charAt(0).toUpperCase();
        const roleLabel = user.role === "teacher" ? "Guru" : "Siswa";
        const totalKunjungan = historyData.success ? historyData.data.length : 0;

        // Set avatar
        document.getElementById("detailAvatar").textContent = initial;

        // Hitung total durasi (jika ada data waktu)
        let totalMenit = 0;
        if (historyData.success && historyData.data.length > 0) {
            // Hitung durasi dari created_at if available
            totalMenit = 0; // placeholder — bisa dihitung jika ada jam keluar
        }

        const totalDurasiLabel = totalMenit > 0 ? `${totalMenit} mnt` : "-";

        document.getElementById("profileInfo").innerHTML = `
            <div class="detail-name">${user.username}</div>
            <div class="detail-nis-code">${user.nis}</div>
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
                    <span class="detail-info-value" style="font-size:0.78rem;">${user.email || "-"}</span>
                </div>
                <div class="detail-info-row">
                    <span class="detail-info-label">UID RFID</span>
                    <span class="detail-info-value rfid-badge">${user.idcard || "-"}</span>
                </div>
            </div>
            <div class="detail-stats-row">
                <div class="detail-stat-box">
                    <div class="detail-stat-number">${totalKunjungan}</div>
                    <div class="detail-stat-label">Total Kunjungan</div>
                </div>
                <div class="detail-stat-box">
                    <div class="detail-stat-number">${totalDurasiLabel}</div>
                    <div class="detail-stat-label">Total Durasi</div>
                </div>
            </div>
        `;

        // Tampilkan tombol edit
        btnEdit.style.display = "block";
        btnEdit.onclick = () => actionEditSiswa(user.nis, user.email);

        // === RENDER RIWAYAT ===
        const historyEl = document.getElementById("historyContent");
        if (!historyData.success || historyData.data.length === 0) {
            historyEl.innerHTML = `
                <div class="detail-empty-history">
                    <i class="bi bi-calendar-x" style="font-size:2rem; display:block; margin-bottom:8px;"></i>
                    Belum ada riwayat absensi.
                </div>`;
            return;
        }

        const rows = historyData.data.map(att => {
            const dt = new Date(att.created_at);
            const tanggal = dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
            const jamMasuk = dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
            const statusClass = att.status === "Hadir" ? "status-badge-hadir" : "status-badge-lainnya";

            return `
                <tr>
                    <td>${tanggal}</td>
                    <td><span class="jam-badge-masuk">${jamMasuk}</span></td>
                    <td><span class="jam-badge-keluar">-</span></td>
                    <td>-</td>
                    <td><span class="${statusClass}">${att.status || "Hadir"}</span></td>
                </tr>
            `;
        }).join("");

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
    .catch(err => {
        document.getElementById("profileInfo").innerHTML =
            `<p style="color:red; text-align:center;">Gagal memuat data: ${err.message}</p>`;
    });
}