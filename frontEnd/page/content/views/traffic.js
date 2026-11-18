/**
 * ScanGo - Traffic Tap Kartu & Analisis Jam Puncak Absensi
 * Modul Frontend Controller untuk memeriksa lalu lintas tap kartu RFID,
 * jeda antar tap (durasi detik), analisis waktu puncak absensi, dan log riwayat.
 */

function renderTraffic() {
  const todayStr = new Date().toISOString().split("T")[0];

  return `
    <div class="traffic-wrapper animate__animated animate__fadeIn">

      <!-- ── Metric Cards Ringkasan ──────────────────────────────────────── -->
      <div class="traffic-summary-grid">
        <!-- Total Tap -->
        <div class="traffic-metric-card">
          <div class="traffic-icon-box" style="background: #EEF2FF; color: #4F46E5;">
            <i class="bi bi-broadcast"></i>
          </div>
          <div class="traffic-metric-info">
            <div class="traffic-metric-val" id="traf-total-taps">-</div>
            <div class="traffic-metric-label">Total Tap Kartu</div>
            <div class="traffic-metric-sub" id="traf-sub-taps">Menghitung data...</div>
          </div>
        </div>

        <!-- Waktu Puncak Absensi -->
        <div class="traffic-metric-card">
          <div class="traffic-icon-box" style="background: #FEF2F2; color: #DC2626;">
            <i class="bi bi-fire"></i>
          </div>
          <div class="traffic-metric-info">
            <div class="traffic-metric-val text-danger" id="traf-peak-range">-</div>
            <div class="traffic-metric-label">Waktu Puncak Absensi</div>
            <div class="traffic-metric-sub" id="traf-peak-sub">Waktu terpadat siswa tap</div>
          </div>
        </div>

        <!-- Rata-rata Jeda -->
        <div class="traffic-metric-card">
          <div class="traffic-icon-box" style="background: #ECFDF5; color: #059669;">
            <i class="bi bi-stopwatch"></i>
          </div>
          <div class="traffic-metric-info">
            <div class="traffic-metric-val" id="traf-avg-gap">-</div>
            <div class="traffic-metric-label">Rata-rata Jeda Antar Tap</div>
            <div class="traffic-metric-sub" id="traf-avg-sub">Interval antar kartu</div>
          </div>
        </div>

        <!-- Jeda Tercepat & Terlama -->
        <div class="traffic-metric-card">
          <div class="traffic-icon-box" style="background: #FFFBEB; color: #D97706;">
            <i class="bi bi-speedometer2"></i>
          </div>
          <div class="traffic-metric-info">
            <div class="traffic-metric-val" style="font-size: 1.15rem;" id="traf-min-max-gap">-</div>
            <div class="traffic-metric-label">Jeda Tercepat vs Terlama</div>
            <div class="traffic-metric-sub" id="traf-rate-sub">Fluktuasi antrean</div>
          </div>
        </div>
      </div>

      <!-- ── Panel Filter & Kontrol ──────────────────────────────────────── -->
      <div class="traffic-control-panel">
        <div class="traffic-control-row">
          
          <div class="traffic-filters-group">
            <!-- Filter Tanggal -->
            <div class="traffic-filter-item">
              <label for="trafFilterDate"><i class="bi bi-calendar3"></i> Tanggal:</label>
              <input type="date" id="trafFilterDate" class="form-control" value="${todayStr}">
            </div>

            <!-- Filter Interval Waktu Puncak -->
            <div class="traffic-filter-item">
              <label for="trafFilterInterval"><i class="bi bi-clock-history"></i> Interval:</label>
              <select id="trafFilterInterval" class="form-select">
                <option value="15">Per 15 Menit</option>
                <option value="30" selected>Per 30 Menit</option>
                <option value="60">Per 1 Jam</option>
              </select>
            </div>

            <!-- Filter Mode Absen -->
            <div class="traffic-filter-item">
              <label for="trafFilterMode"><i class="bi bi-arrow-left-right"></i> Tipe Tap:</label>
              <select id="trafFilterMode" class="form-select">
                <option value="all" selected>Semua (Masuk & Keluar)</option>
                <option value="masuk">Hanya Tap Masuk</option>
                <option value="keluar">Hanya Tap Keluar</option>
              </select>
            </div>

            <!-- Pencarian Siswa / Kartu -->
            <div class="traffic-filter-item" style="flex: 1; min-width: 180px;">
              <input type="text" id="trafSearchInput" class="form-control" placeholder="Cari nama, NIS, atau RFID...">
            </div>
          </div>

          <!-- Aksi Tombol -->
          <div class="traffic-actions-group">
            <!-- Live Auto Refresh Toggle -->
            <button type="button" id="trafLiveToggle" class="live-toggle-btn" title="Nyalakan pemantauan traffic live setiap 10 detik">
              <span class="live-dot"></span>
              <span id="trafLiveLabel">Live Sync: Off</span>
            </button>

            <!-- Refresh Manual -->
            <button type="button" id="trafRefreshBtn" class="btn btn-outline-secondary btn-sm" title="Muat ulang data">
              <i class="bi bi-arrow-clockwise"></i>
            </button>

            <!-- Export CSV -->
            <button type="button" id="trafExportBtn" class="btn btn-primary btn-sm d-flex align-items-center gap-1" title="Unduh laporan traffic sebagai CSV">
              <i class="bi bi-download"></i> Ekspor CSV
            </button>
          </div>

        </div>

        <!-- Visualisasi Mini Histogram Kepadatan Jam Puncak -->
        <div id="trafTimelineContainer" style="display: none; margin-top: 14px;">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <span class="small fw-semibold text-muted">
              <i class="bi bi-bar-chart"></i> Visualisasi Distribusi Jam Puncak:
            </span>
            <span class="small text-muted" id="trafTimelineLegend">Merah = Puncak Absensi</span>
          </div>
          <div class="traffic-timeline-bar" id="trafTimelineBar"></div>
        </div>
      </div>

      <!-- ── Tabel 1: Analisis Waktu Puncak Absensi ──────────────────────── -->
      <div class="traffic-panel">
        <div class="traffic-panel-head">
          <div class="traffic-panel-title">
            <h3><i class="bi bi-graph-up-arrow text-danger"></i> Analisis Waktu Puncak Absensi</h3>
            <p>Daftar rentang jam absensi, total tap kartu, dan analisis kepadatan antrean</p>
          </div>
          <span class="badge bg-light text-dark border px-3 py-2 rounded-pill" id="trafPeakTablePill">
            <i class="bi bi-funnel"></i> Interval <span id="trafIntervalLabel">30 Menit</span>
          </span>
        </div>

        <div class="traffic-table-responsive">
          <table class="traffic-table" id="trafPeakTable">
            <thead>
              <tr>
                <th style="width: 50px;">No</th>
                <th>Rentang Jam (Dari - Ke)</th>
                <th class="text-center">Total Tap</th>
                <th class="text-center">Rata-rata Jeda</th>
                <th class="text-center">Jeda Tercepat</th>
                <th class="text-center">Jeda Terlama</th>
                <th>Distribusi Kehadiran</th>
                <th class="text-center">Status Kepadatan</th>
              </tr>
            </thead>
            <tbody id="trafPeakTableBody">
              <tr>
                <td colspan="8" class="traffic-empty-state">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span class="ms-2">Menganalisis data traffic...</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── Tabel 2: Log Detail Traffic Tap Kartu Berurutan ─────────────── -->
      <div class="traffic-panel">
        <div class="traffic-panel-head">
          <div class="traffic-panel-title">
            <h3><i class="bi bi-stopwatch text-primary"></i> Log Jeda Tap Kartu Berurutan</h3>
            <p>Catatan kronologis setiap tap kartu beserta durasi jeda dengan tap sebelumnya</p>
          </div>
          <div class="d-flex align-items-center gap-2">
            <span class="badge bg-light text-dark border px-3 py-2 rounded-pill" id="trafLogCountPill">
              0 Tap Tercatat
            </span>
          </div>
        </div>

        <div class="traffic-table-responsive">
          <table class="traffic-table" id="trafLogsTable">
            <thead>
              <tr>
                <th style="width: 60px;">#</th>
                <th>Waktu Tap (WIB)</th>
                <th>Jeda dari Tap Sebelumnya</th>
                <th>Nama Siswa / Pengguna</th>
                <th>NIS</th>
                <th>RFID IDCard</th>
                <th>Rombel & Kelas</th>
                <th class="text-center">Tipe Tap</th>
                <th>Perangkat Reader</th>
                <th class="text-center">Status</th>
              </tr>
            </thead>
            <tbody id="trafLogsTableBody">
              <tr>
                <td colspan="10" class="traffic-empty-state">
                  <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
                  <span class="ms-2">Memuat log tap...</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

// Global traffic state
window.trafficState = {
  selectedDate: new Date().toISOString().split("T")[0],
  selectedInterval: 30,
  selectedMode: "all",
  searchQuery: "",
  isLive: false,
  liveTimer: null,
  cachedData: null,
  clockTimer: null,
};

function formatTrafficDuration(sec) {
  if (sec === null || sec === undefined) return "-";
  if (sec < 60) return `${sec} dtk`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}d` : `${m} mnt`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return remM > 0 ? `${h}j ${remM}m` : `${h} jam`;
}

function getJedaBadgeHTML(sec, isFirst) {
  if (isFirst || sec === null || sec === undefined) {
    return `<span class="badge-jeda badge-jeda-first"><i class="bi bi-flag"></i> Tap Awal</span>`;
  }
  if (sec < 5) {
    return `<span class="badge-jeda badge-jeda-rush"><i class="bi bi-lightning-charge-fill"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  if (sec <= 15) {
    return `<span class="badge-jeda badge-jeda-fast"><i class="bi bi-check-circle-fill"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  if (sec <= 60) {
    return `<span class="badge-jeda badge-jeda-normal"><i class="bi bi-clock"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  return `<span class="badge-jeda badge-jeda-idle"><i class="bi bi-pause"></i> +${formatTrafficDuration(sec)}</span>`;
}

/**
 * Client-side calculation fallback jika endpoint /traffic belum terjangkau
 */
function calculateTrafficLocally(attendances, users, targetDateStr, intervalMinutes, mode) {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const usersList = users || [];

  // Parse start and end of target day
  const parts = targetDateStr.split("-").map(Number);
  const startDay = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0) - WIB_OFFSET_MS).getTime();
  const endDay = startDay + 24 * 60 * 60 * 1000 - 1;

  const tapEvents = [];

  (attendances || []).forEach((att) => {
    const idKartu = String(att.card_id || att.idcard || "").trim();
    const user = usersList.find((u) => String(u.idcard || "").trim() === idKartu);

    // Tap Masuk
    if ((mode === "all" || mode === "masuk") && att.created_at) {
      const ts = new Date(att.created_at).getTime();
      if (ts >= startDay && ts <= endDay) {
        tapEvents.push({
          id: `${att.id}-masuk`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || user?.name || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "masuk",
          type_label: "Tap Masuk",
          status: att.status || "Hadir",
          mac_address: att.mac_address || "RFID Reader Card",
          note: att.note || "-",
          timestamp: ts,
          iso_time: att.created_at,
        });
      }
    }

    // Tap Keluar
    if ((mode === "all" || mode === "keluar") && att.time_finish) {
      const ts = new Date(att.time_finish).getTime();
      if (ts >= startDay && ts <= endDay) {
        tapEvents.push({
          id: `${att.id}-keluar`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || user?.name || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "keluar",
          type_label: "Tap Keluar",
          status: "Pulang",
          mac_address: att.mac_address || "RFID Reader Card",
          note: att.note || "-",
          timestamp: ts,
          iso_time: att.time_finish,
        });
      }
    }
  });

  // Urutkan kronologis
  tapEvents.sort((a, b) => a.timestamp - b.timestamp);

  let totalGapSeconds = 0;
  let gapCount = 0;
  let minGapSeconds = null;
  let maxGapSeconds = null;

  tapEvents.forEach((ev, idx) => {
    const dWib = new Date(ev.timestamp + WIB_OFFSET_MS);
    const hh = String(dWib.getUTCHours()).padStart(2, "0");
    const mm = String(dWib.getUTCMinutes()).padStart(2, "0");
    const ss = String(dWib.getUTCSeconds()).padStart(2, "0");
    ev.time_wib = `${hh}:${mm}:${ss}`;

    if (idx === 0) {
      ev.jeda_seconds = null;
      ev.jeda_formatted = "-";
      ev.jeda_badge = "first";
      ev.jeda_desc = "Tap Pertama";
    } else {
      const diffMs = ev.timestamp - tapEvents[idx - 1].timestamp;
      const diffSec = Math.max(0, Math.round(diffMs / 1000));
      ev.jeda_seconds = diffSec;
      ev.jeda_formatted = formatTrafficDuration(diffSec);

      totalGapSeconds += diffSec;
      gapCount++;

      if (minGapSeconds === null || diffSec < minGapSeconds) minGapSeconds = diffSec;
      if (maxGapSeconds === null || diffSec > maxGapSeconds) maxGapSeconds = diffSec;

      if (diffSec < 5) {
        ev.jeda_badge = "rush";
        ev.jeda_desc = "⚡ Sangat Cepat (< 5 dtk)";
      } else if (diffSec <= 15) {
        ev.jeda_badge = "fast";
        ev.jeda_desc = "🟢 Cepat (5-15 dtk)";
      } else if (diffSec <= 60) {
        ev.jeda_badge = "normal";
        ev.jeda_desc = "🟡 Normal (16-60 dtk)";
      } else {
        ev.jeda_badge = "idle";
        ev.jeda_desc = "⚪ Renggang (> 60 dtk)";
      }
    }
  });

  // Bucket interval
  const bucketMap = new Map();
  tapEvents.forEach((ev) => {
    const dateWib = new Date(ev.timestamp + WIB_OFFSET_MS);
    const totalMinutes = dateWib.getUTCHours() * 60 + dateWib.getUTCMinutes();
    const slotStart = Math.floor(totalMinutes / intervalMinutes) * intervalMinutes;
    const slotEnd = slotStart + intervalMinutes;

    const formatHHMM = (min) => {
      const hVal = Math.floor(min / 60) % 24;
      const mVal = min % 60;
      return `${String(hVal).padStart(2, "0")}:${String(mVal).padStart(2, "0")}`;
    };

    const key = `${formatHHMM(slotStart)} - ${formatHHMM(slotEnd)}`;
    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        time_range: key,
        start_minutes: slotStart,
        end_minutes: slotEnd,
        total_taps: 0,
        gaps: [],
      });
    }
    const b = bucketMap.get(key);
    b.total_taps++;
    if (ev.jeda_seconds !== null && ev.jeda_seconds !== undefined) {
      b.gaps.push(ev.jeda_seconds);
    }
  });

  const buckets = Array.from(bucketMap.values()).sort((a, b) => a.start_minutes - b.start_minutes);
  const maxTaps = Math.max(0, ...buckets.map((b) => b.total_taps));

  const peakAnalysisTable = buckets.map((b, idx) => {
    const avgGap =
      b.gaps.length > 0
        ? Math.round((b.gaps.reduce((acc, g) => acc + g, 0) / b.gaps.length) * 10) / 10
        : null;
    const minGap = b.gaps.length > 0 ? Math.min(...b.gaps) : null;
    const maxGap = b.gaps.length > 0 ? Math.max(...b.gaps) : null;
    const pct = tapEvents.length > 0 ? Math.round((b.total_taps / tapEvents.length) * 1000) / 10 : 0;

    let status = "Lengang";
    let status_badge = "success";
    let is_peak = false;

    if (b.total_taps === maxTaps && maxTaps > 0) {
      status = "PUNCAK UTAMA";
      status_badge = "danger";
      is_peak = true;
    } else if (b.total_taps >= maxTaps * 0.7 && maxTaps > 0) {
      status = "Sangat Ramai";
      status_badge = "warning";
    } else if (b.total_taps >= maxTaps * 0.35 && maxTaps > 0) {
      status = "Sedang";
      status_badge = "info";
    }

    return {
      no: idx + 1,
      time_range: b.time_range,
      total_taps: b.total_taps,
      percentage: pct,
      avg_jeda_seconds: avgGap,
      avg_jeda_formatted: avgGap !== null ? `${avgGap} dtk` : "-",
      min_jeda_seconds: minGap,
      min_jeda_formatted: minGap !== null ? formatTrafficDuration(minGap) : "-",
      max_jeda_seconds: maxGap,
      max_jeda_formatted: maxGap !== null ? formatTrafficDuration(maxGap) : "-",
      status,
      status_badge,
      is_peak,
    };
  });

  const peakBucket = peakAnalysisTable.find((b) => b.is_peak) || null;
  const avgOverallGap = gapCount > 0 ? Math.round((totalGapSeconds / gapCount) * 10) / 10 : null;

  return {
    success: true,
    query: { date: targetDateStr, interval: intervalMinutes, mode },
    summary: {
      total_taps: tapEvents.length,
      peak_time_range: peakBucket ? peakBucket.time_range : "-",
      peak_taps: peakBucket ? peakBucket.total_taps : 0,
      peak_percentage: peakBucket ? peakBucket.percentage : 0,
      avg_interval_seconds: avgOverallGap,
      avg_interval_formatted: avgOverallGap !== null ? `${avgOverallGap} dtk` : "-",
      min_interval_seconds: minGapSeconds,
      min_interval_formatted: minGapSeconds !== null ? formatTrafficDuration(minGapSeconds) : "-",
      max_interval_seconds: maxGapSeconds,
      max_interval_formatted: maxGapSeconds !== null ? formatTrafficDuration(maxGapSeconds) : "-",
      peak_throughput_per_minute:
        peakBucket && intervalMinutes > 0
          ? Math.round((peakBucket.total_taps / intervalMinutes) * 10) / 10
          : 0,
    },
    peak_analysis: peakAnalysisTable,
    tap_logs: tapEvents.slice().reverse(),
  };
}

/**
 * Controller utama: Fetch data & Update DOM
 */
async function loadTrafficData() {
  const { selectedDate, selectedInterval, selectedMode } = window.trafficState;
  const apiBase = window.API_BASE || "";

  // Tampilkan loading indicators
  const peakBody = document.getElementById("trafPeakTableBody");
  const logBody = document.getElementById("trafLogsTableBody");
  if (peakBody && !window.trafficState.cachedData) {
    peakBody.innerHTML = `<tr><td colspan="8" class="traffic-empty-state"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><span class="ms-2">Menganalisis data traffic...</span></td></tr>`;
  }
  if (logBody && !window.trafficState.cachedData) {
    logBody.innerHTML = `<tr><td colspan="10" class="traffic-empty-state"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><span class="ms-2">Memuat riwayat tap...</span></td></tr>`;
  }

  let resultData = null;

  try {
    // Coba endpoint backend khusus /traffic
    const url = `${apiBase}/api/v1/attendances/traffic?date=${selectedDate}&interval=${selectedInterval}&mode=${selectedMode}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        resultData = json;
      }
    }
  } catch (err) {
    console.warn("Endpoint traffic v1 belum aktif, beralih ke fallback komputasi:", err);
  }

  // Fallback: ambil semua attendances & hitung di sisi client
  if (!resultData) {
    try {
      const fallbackUrl = `${apiBase}/api/attendances`;
      const res = await fetch(fallbackUrl);
      const json = await res.json();
      const attendances = json?.data || [];
      resultData = calculateTrafficLocally(attendances, [], selectedDate, selectedInterval, selectedMode);
    } catch (e) {
      console.error("Gagal memuat fallback data absensi:", e);
    }
  }

  if (!resultData) {
    if (peakBody) {
      peakBody.innerHTML = `<tr><td colspan="8" class="traffic-empty-state text-danger"><i class="bi bi-exclamation-triangle"></i> Gagal memuat data traffic. Silahkan coba muat ulang.</td></tr>`;
    }
    if (logBody) {
      logBody.innerHTML = `<tr><td colspan="10" class="traffic-empty-state text-danger"><i class="bi bi-exclamation-triangle"></i> Gagal memuat log tap.</td></tr>`;
    }
    return;
  }

  window.trafficState.cachedData = resultData;
  renderTrafficViews(resultData);
}

/**
 * Render semua bagian tampilan setelah data diterima
 */
function renderTrafficViews(data) {
  const summary = data.summary || {};
  const peakTable = data.peak_analysis || [];
  const tapLogs = data.tap_logs || [];
  const searchQuery = (window.trafficState.searchQuery || "").toLowerCase().trim();

  // 1. Metric Cards
  const valTotalTaps = document.getElementById("traf-total-taps");
  const subTotalTaps = document.getElementById("traf-sub-taps");
  const valPeakRange = document.getElementById("traf-peak-range");
  const subPeakRange = document.getElementById("traf-peak-sub");
  const valAvgGap = document.getElementById("traf-avg-gap");
  const subAvgGap = document.getElementById("traf-avg-sub");
  const valMinMax = document.getElementById("traf-min-max-gap");
  const subRate = document.getElementById("traf-rate-sub");

  if (valTotalTaps) valTotalTaps.textContent = `${summary.total_taps || 0} Tap`;
  if (subTotalTaps) {
    subTotalTaps.textContent = `Tanggal: ${window.trafficState.selectedDate}`;
  }

  if (valPeakRange) {
    valPeakRange.textContent = summary.peak_time_range !== "-" ? summary.peak_time_range : "Belum Ada";
  }
  if (subPeakRange) {
    subPeakRange.innerHTML = summary.peak_taps > 0
      ? `<span class="badge bg-danger text-white"><i class="bi bi-fire"></i> ${summary.peak_taps} Tap (${summary.peak_percentage}%)</span>`
      : "Tidak ada tap di tanggal ini";
  }

  if (valAvgGap) {
    valAvgGap.textContent = summary.avg_interval_formatted || "-";
  }
  if (subAvgGap) {
    subAvgGap.textContent = summary.avg_interval_seconds
      ? `Rerata selisih antar kartu masuk`
      : "Belum cukup data interval";
  }

  if (valMinMax) {
    valMinMax.textContent = summary.min_interval_formatted && summary.max_interval_formatted
      ? `${summary.min_interval_formatted} / ${summary.max_interval_formatted}`
      : "-";
  }
  if (subRate) {
    subRate.textContent = summary.peak_throughput_per_minute > 0
      ? `Throughput: ~${summary.peak_throughput_per_minute} tap/mnt di jam puncak`
      : "Min / Max durasi jeda";
  }

  // 2. Timeline Mini Histogram
  const timelineContainer = document.getElementById("trafTimelineContainer");
  const timelineBar = document.getElementById("trafTimelineBar");
  if (timelineContainer && timelineBar) {
    if (peakTable.length > 0) {
      timelineContainer.style.display = "block";
      const maxTaps = Math.max(1, ...peakTable.map((p) => p.total_taps));
      timelineBar.innerHTML = peakTable
        .map((p) => {
          const heightPct = Math.max(12, Math.round((p.total_taps / maxTaps) * 100));
          return `
            <div class="timeline-slot ${p.is_peak ? "peak" : ""}" title="${p.time_range}: ${p.total_taps} tap (${p.percentage}%)">
              <div class="timeline-bar-col" style="height: ${heightPct}%;"></div>
              <span class="timeline-label">${p.time_range.split(" - ")[0]}</span>
            </div>
          `;
        })
        .join("");
    } else {
      timelineContainer.style.display = "none";
    }
  }

  // 3. Tabel Analisis Waktu Puncak
  const peakBody = document.getElementById("trafPeakTableBody");
  const intervalLabel = document.getElementById("trafIntervalLabel");
  if (intervalLabel) {
    intervalLabel.textContent = `${window.trafficState.selectedInterval} Menit`;
  }

  if (peakBody) {
    if (peakTable.length === 0) {
      peakBody.innerHTML = `
        <tr>
          <td colspan="8" class="traffic-empty-state">
            <i class="bi bi-clock-history"></i>
            <div>Tidak ada aktivitas tap kartu pada tanggal ini.</div>
          </td>
        </tr>
      `;
    } else {
      peakBody.innerHTML = peakTable
        .map((row) => {
          const isPeak = row.is_peak;
          const peakBadge = isPeak
            ? `<span class="badge-status badge-status-danger"><i class="bi bi-fire"></i> PUNCAK UTAMA</span>`
            : row.status_badge === "warning"
            ? `<span class="badge-status badge-status-warning"><i class="bi bi-people-fill"></i> Sangat Ramai</span>`
            : row.status_badge === "info"
            ? `<span class="badge-status badge-status-info"><i class="bi bi-person-fill"></i> Sedang</span>`
            : `<span class="badge-status badge-status-success"><i class="bi bi-check2"></i> Lengang</span>`;

          return `
            <tr class="${isPeak ? "peak-row" : ""}">
              <td class="fw-bold text-muted">${row.no}</td>
              <td>
                <span class="time-mono ${isPeak ? "text-danger fw-bold" : ""}">${row.time_range}</span>
                ${isPeak ? '<span class="badge bg-danger text-white ms-2">Rush Hour</span>' : ""}
              </td>
              <td class="text-center fw-bold">${row.total_taps}</td>
              <td class="text-center">
                <span class="time-mono">${row.avg_jeda_formatted}</span>
              </td>
              <td class="text-center">
                <span class="time-mono text-success">${row.min_jeda_formatted}</span>
              </td>
              <td class="text-center">
                <span class="time-mono text-muted">${row.max_jeda_formatted}</span>
              </td>
              <td>
                <div class="peak-progress-wrap">
                  <div class="peak-progress-bar">
                    <div class="peak-progress-fill ${isPeak ? "peak" : ""}" style="width: ${row.percentage}%;"></div>
                  </div>
                  <span class="peak-progress-text">${row.percentage}%</span>
                </div>
              </td>
              <td class="text-center">${peakBadge}</td>
            </tr>
          `;
        })
        .join("");
    }
  }

  // 4. Tabel Log Detail Traffic Tap Kartu
  const logBody = document.getElementById("trafLogsTableBody");
  const countPill = document.getElementById("trafLogCountPill");

  // Filter search
  const filteredLogs = tapLogs.filter((log) => {
    if (!searchQuery) return true;
    return (
      (log.username || "").toLowerCase().includes(searchQuery) ||
      String(log.nis || "").toLowerCase().includes(searchQuery) ||
      String(log.idcard || "").toLowerCase().includes(searchQuery) ||
      (log.rombel || "").toLowerCase().includes(searchQuery)
    );
  });

  if (countPill) {
    countPill.textContent = `${filteredLogs.length} Tap Ditampilkan`;
  }

  if (logBody) {
    if (filteredLogs.length === 0) {
      logBody.innerHTML = `
        <tr>
          <td colspan="10" class="traffic-empty-state">
            <i class="bi bi-inbox"></i>
            <div>${searchQuery ? "Tidak ada tap yang cocok dengan kata kunci pencarian." : "Belum ada riwayat tap kartu untuk tanggal ini."}</div>
          </td>
        </tr>
      `;
    } else {
      logBody.innerHTML = filteredLogs
        .map((log, index) => {
          const typeBadge = log.type === "keluar"
            ? `<span class="badge bg-info text-dark"><i class="bi bi-box-arrow-right"></i> Keluar</span>`
            : `<span class="badge bg-success"><i class="bi bi-box-arrow-in-right"></i> Masuk</span>`;

          const jedaHTML = getJedaBadgeHTML(log.jeda_seconds, log.jeda_badge === "first");

          return `
            <tr>
              <td class="text-muted small">${index + 1}</td>
              <td>
                <span class="time-mono">${log.time_wib || "-"}</span>
              </td>
              <td>
                ${jedaHTML}
              </td>
              <td class="fw-semibold">
                <i class="bi bi-person me-1 text-primary"></i> ${log.username || "Siswa"}
              </td>
              <td>
                <span class="badge bg-light text-dark border">${log.nis || "-"}</span>
              </td>
              <td>
                <span class="time-mono small text-secondary">${log.idcard || "-"}</span>
              </td>
              <td>
                <span>${log.rombel || "-"}</span>
              </td>
              <td class="text-center">${typeBadge}</td>
              <td class="small text-muted">${log.mac_address || "RFID Reader"}</td>
              <td class="text-center">
                <span class="badge bg-light text-secondary border">${log.status || "Hadir"}</span>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }
}

/**
 * Ekspor Data Traffic ke File CSV
 */
function exportTrafficToCSV() {
  const state = window.trafficState;
  const data = state.cachedData;
  if (!data || !data.tap_logs || data.tap_logs.length === 0) {
    alert("Tidak ada data tap untuk diekspor!");
    return;
  }

  let csv = "\uFEFF"; // UTF-8 BOM untuk Excel
  csv += `LAPORAN TRAFFIC TAP KARTU & ANALISIS JAM PUNCAK SCANGO\n`;
  csv += `Tanggal: ${state.selectedDate}\n`;
  csv += `Total Tap: ${data.summary?.total_taps || 0}\n`;
  csv += `Waktu Puncak Absensi: ${data.summary?.peak_time_range || "-"}\n`;
  csv += `Rata-rata Jeda Antar Tap: ${data.summary?.avg_interval_formatted || "-"}\n\n`;

  // Bagian 1: Analisis Jam Puncak
  csv += `TABEL 1: ANALISIS WAKTU PUNCAK ABSENSI\n`;
  csv += `No,Rentang Jam,Total Tap,Rata-rata Jeda,Jeda Tercepat,Jeda Terlama,Persentase,Status Kepadatan\n`;
  (data.peak_analysis || []).forEach((row) => {
    csv += `"${row.no}","${row.time_range}","${row.total_taps}","${row.avg_jeda_formatted}","${row.min_jeda_formatted}","${row.max_jeda_formatted}","${row.percentage}%","${row.status}"\n`;
  });

  csv += `\nTABEL 2: LOG RIWAYAT TAP KARTU BERURUTAN\n`;
  csv += `No,Waktu Tap WIB,Jeda Detik,Jeda Format,Nama Siswa,NIS,RFID IDCard,Rombel,Tipe Tap,Reader,Status\n`;
  (data.tap_logs || []).forEach((log, idx) => {
    csv += `"${idx + 1}","${log.time_wib || "-"}","${log.jeda_seconds ?? "-"}","${log.jeda_formatted || "-"}","${log.username || "-"}","${log.nis || "-"}","${log.idcard || "-"}","${log.rombel || "-"}","${log.type_label || log.type}","${log.mac_address || "-"}","${log.status || "-"}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Traffic_Tap_Kartu_${state.selectedDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Event Listener & Clock Initializer
 */
function initTrafficListener() {
  // 1. Clock in Header Panel
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");

  function updateTrafficClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    if (timeEl) timeEl.textContent = `${hh}:${mm}:${ss} WIB`;

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  if (window.trafficState.clockTimer) {
    clearInterval(window.trafficState.clockTimer);
  }
  updateTrafficClock();
  window.trafficState.clockTimer = setInterval(updateTrafficClock, 1000);

  // 2. Element references
  const filterDate = document.getElementById("trafFilterDate");
  const filterInterval = document.getElementById("trafFilterInterval");
  const filterMode = document.getElementById("trafFilterMode");
  const searchInput = document.getElementById("trafSearchInput");
  const refreshBtn = document.getElementById("trafRefreshBtn");
  const liveToggle = document.getElementById("trafLiveToggle");
  const liveLabel = document.getElementById("trafLiveLabel");
  const exportBtn = document.getElementById("trafExportBtn");

  // Sync state values ke form input
  if (filterDate) filterDate.value = window.trafficState.selectedDate;
  if (filterInterval) filterInterval.value = String(window.trafficState.selectedInterval);
  if (filterMode) filterMode.value = window.trafficState.selectedMode;
  if (searchInput) searchInput.value = window.trafficState.searchQuery;

  // 3. Event Listeners
  if (filterDate) {
    filterDate.addEventListener("change", (e) => {
      window.trafficState.selectedDate = e.target.value;
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (filterInterval) {
    filterInterval.addEventListener("change", (e) => {
      window.trafficState.selectedInterval = parseInt(e.target.value, 10) || 30;
      loadTrafficData();
    });
  }

  if (filterMode) {
    filterMode.addEventListener("change", (e) => {
      window.trafficState.selectedMode = e.target.value;
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      window.trafficState.searchQuery = e.target.value;
      if (window.trafficState.cachedData) {
        renderTrafficViews(window.trafficState.cachedData);
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportTrafficToCSV);
  }

  // 4. Live Mode Auto Refresh
  if (liveToggle) {
    liveToggle.addEventListener("click", () => {
      window.trafficState.isLive = !window.trafficState.isLive;
      if (window.trafficState.isLive) {
        liveToggle.classList.add("active");
        if (liveLabel) liveLabel.textContent = "Live Sync: On";
        // Jalankan polling setiap 10 detik
        if (window.trafficState.liveTimer) clearInterval(window.trafficState.liveTimer);
        window.trafficState.liveTimer = setInterval(() => {
          loadTrafficData();
        }, 10000);
      } else {
        liveToggle.classList.remove("active");
        if (liveLabel) liveLabel.textContent = "Live Sync: Off";
        if (window.trafficState.liveTimer) {
          clearInterval(window.trafficState.liveTimer);
          window.trafficState.liveTimer = null;
        }
      }
    });
  }

  // 5. Initial fetch
  loadTrafficData();
}

// Pastikan fungsi terdaftar di window object
window.renderTraffic = renderTraffic;
window.initTrafficListener = initTrafficListener;

// Auto-render saat halaman traffic dibuka langsung (bukan via SPA router)
document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");
  if (content && typeof renderTraffic === "function" && !content.dataset.rendered) {
    content.innerHTML = renderTraffic();
    content.dataset.rendered = "1";
    if (typeof initTrafficListener === "function") initTrafficListener();
  }
});


// Global traffic state
window.trafficState = {
  selectedDate: new Date().toISOString().split("T")[0],
  selectedInterval: 30,
  selectedMode: "all",
  searchQuery: "",
  isLive: false,
  liveTimer: null,
  cachedData: null,
  clockTimer: null,
};

function formatTrafficDuration(sec) {
  if (sec === null || sec === undefined) return "-";
  if (sec < 60) return `${sec} dtk`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m}m ${s}d` : `${m} mnt`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return remM > 0 ? `${h}j ${remM}m` : `${h} jam`;
}

function getJedaBadgeHTML(sec, isFirst) {
  if (isFirst || sec === null || sec === undefined) {
    return `<span class="badge-jeda badge-jeda-first"><i class="bi bi-flag"></i> Tap Awal</span>`;
  }
  if (sec < 5) {
    return `<span class="badge-jeda badge-jeda-rush"><i class="bi bi-lightning-charge-fill"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  if (sec <= 15) {
    return `<span class="badge-jeda badge-jeda-fast"><i class="bi bi-check-circle-fill"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  if (sec <= 60) {
    return `<span class="badge-jeda badge-jeda-normal"><i class="bi bi-clock"></i> +${formatTrafficDuration(sec)}</span>`;
  }
  return `<span class="badge-jeda badge-jeda-idle"><i class="bi bi-pause"></i> +${formatTrafficDuration(sec)}</span>`;
}

/**
 * Client-side calculation fallback jika endpoint /traffic belum terjangkau
 */
function calculateTrafficLocally(attendances, users, targetDateStr, intervalMinutes, mode) {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const usersList = users || [];

  // Parse start and end of target day
  const parts = targetDateStr.split("-").map(Number);
  const startDay = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2], 0, 0, 0) - WIB_OFFSET_MS).getTime();
  const endDay = startDay + 24 * 60 * 60 * 1000 - 1;

  const tapEvents = [];

  (attendances || []).forEach((att) => {
    const idKartu = String(att.card_id || att.idcard || "").trim();
    const user = usersList.find((u) => String(u.idcard || "").trim() === idKartu);

    // Tap Masuk
    if ((mode === "all" || mode === "masuk") && att.created_at) {
      const ts = new Date(att.created_at).getTime();
      if (ts >= startDay && ts <= endDay) {
        tapEvents.push({
          id: `${att.id}-masuk`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || user?.name || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "masuk",
          type_label: "Tap Masuk",
          status: att.status || "Hadir",
          mac_address: att.mac_address || "RFID Reader Card",
          note: att.note || "-",
          timestamp: ts,
          iso_time: att.created_at,
        });
      }
    }

    // Tap Keluar
    if ((mode === "all" || mode === "keluar") && att.time_finish) {
      const ts = new Date(att.time_finish).getTime();
      if (ts >= startDay && ts <= endDay) {
        tapEvents.push({
          id: `${att.id}-keluar`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || user?.name || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "keluar",
          type_label: "Tap Keluar",
          status: "Pulang",
          mac_address: att.mac_address || "RFID Reader Card",
          note: att.note || "-",
          timestamp: ts,
          iso_time: att.time_finish,
        });
      }
    }
  });

  // Urutkan kronologis
  tapEvents.sort((a, b) => a.timestamp - b.timestamp);

  let totalGapSeconds = 0;
  let gapCount = 0;
  let minGapSeconds = null;
  let maxGapSeconds = null;

  tapEvents.forEach((ev, idx) => {
    const dWib = new Date(ev.timestamp + WIB_OFFSET_MS);
    const hh = String(dWib.getUTCHours()).padStart(2, "0");
    const mm = String(dWib.getUTCMinutes()).padStart(2, "0");
    const ss = String(dWib.getUTCSeconds()).padStart(2, "0");
    ev.time_wib = `${hh}:${mm}:${ss}`;

    if (idx === 0) {
      ev.jeda_seconds = null;
      ev.jeda_formatted = "-";
      ev.jeda_badge = "first";
      ev.jeda_desc = "Tap Pertama";
    } else {
      const diffMs = ev.timestamp - tapEvents[idx - 1].timestamp;
      const diffSec = Math.max(0, Math.round(diffMs / 1000));
      ev.jeda_seconds = diffSec;
      ev.jeda_formatted = formatTrafficDuration(diffSec);

      totalGapSeconds += diffSec;
      gapCount++;

      if (minGapSeconds === null || diffSec < minGapSeconds) minGapSeconds = diffSec;
      if (maxGapSeconds === null || diffSec > maxGapSeconds) maxGapSeconds = diffSec;

      if (diffSec < 5) {
        ev.jeda_badge = "rush";
        ev.jeda_desc = "⚡ Sangat Cepat (< 5 dtk)";
      } else if (diffSec <= 15) {
        ev.jeda_badge = "fast";
        ev.jeda_desc = "🟢 Cepat (5-15 dtk)";
      } else if (diffSec <= 60) {
        ev.jeda_badge = "normal";
        ev.jeda_desc = "🟡 Normal (16-60 dtk)";
      } else {
        ev.jeda_badge = "idle";
        ev.jeda_desc = "⚪ Renggang (> 60 dtk)";
      }
    }
  });

  // Bucket interval
  const bucketMap = new Map();
  tapEvents.forEach((ev) => {
    const dateWib = new Date(ev.timestamp + WIB_OFFSET_MS);
    const totalMinutes = dateWib.getUTCHours() * 60 + dateWib.getUTCMinutes();
    const slotStart = Math.floor(totalMinutes / intervalMinutes) * intervalMinutes;
    const slotEnd = slotStart + intervalMinutes;

    const formatHHMM = (min) => {
      const hVal = Math.floor(min / 60) % 24;
      const mVal = min % 60;
      return `${String(hVal).padStart(2, "0")}:${String(mVal).padStart(2, "0")}`;
    };

    const key = `${formatHHMM(slotStart)} - ${formatHHMM(slotEnd)}`;
    if (!bucketMap.has(key)) {
      bucketMap.set(key, {
        time_range: key,
        start_minutes: slotStart,
        end_minutes: slotEnd,
        total_taps: 0,
        gaps: [],
      });
    }
    const b = bucketMap.get(key);
    b.total_taps++;
    if (ev.jeda_seconds !== null && ev.jeda_seconds !== undefined) {
      b.gaps.push(ev.jeda_seconds);
    }
  });

  const buckets = Array.from(bucketMap.values()).sort((a, b) => a.start_minutes - b.start_minutes);
  const maxTaps = Math.max(0, ...buckets.map((b) => b.total_taps));

  const peakAnalysisTable = buckets.map((b, idx) => {
    const avgGap =
      b.gaps.length > 0
        ? Math.round((b.gaps.reduce((acc, g) => acc + g, 0) / b.gaps.length) * 10) / 10
        : null;
    const minGap = b.gaps.length > 0 ? Math.min(...b.gaps) : null;
    const maxGap = b.gaps.length > 0 ? Math.max(...b.gaps) : null;
    const pct = tapEvents.length > 0 ? Math.round((b.total_taps / tapEvents.length) * 1000) / 10 : 0;

    let status = "Lengang";
    let status_badge = "success";
    let is_peak = false;

    if (b.total_taps === maxTaps && maxTaps > 0) {
      status = "PUNCAK UTAMA";
      status_badge = "danger";
      is_peak = true;
    } else if (b.total_taps >= maxTaps * 0.7 && maxTaps > 0) {
      status = "Sangat Ramai";
      status_badge = "warning";
    } else if (b.total_taps >= maxTaps * 0.35 && maxTaps > 0) {
      status = "Sedang";
      status_badge = "info";
    }

    return {
      no: idx + 1,
      time_range: b.time_range,
      total_taps: b.total_taps,
      percentage: pct,
      avg_jeda_seconds: avgGap,
      avg_jeda_formatted: avgGap !== null ? `${avgGap} dtk` : "-",
      min_jeda_seconds: minGap,
      min_jeda_formatted: minGap !== null ? formatTrafficDuration(minGap) : "-",
      max_jeda_seconds: maxGap,
      max_jeda_formatted: maxGap !== null ? formatTrafficDuration(maxGap) : "-",
      status,
      status_badge,
      is_peak,
    };
  });

  const peakBucket = peakAnalysisTable.find((b) => b.is_peak) || null;
  const avgOverallGap = gapCount > 0 ? Math.round((totalGapSeconds / gapCount) * 10) / 10 : null;

  return {
    success: true,
    query: { date: targetDateStr, interval: intervalMinutes, mode },
    summary: {
      total_taps: tapEvents.length,
      peak_time_range: peakBucket ? peakBucket.time_range : "-",
      peak_taps: peakBucket ? peakBucket.total_taps : 0,
      peak_percentage: peakBucket ? peakBucket.percentage : 0,
      avg_interval_seconds: avgOverallGap,
      avg_interval_formatted: avgOverallGap !== null ? `${avgOverallGap} dtk` : "-",
      min_interval_seconds: minGapSeconds,
      min_interval_formatted: minGapSeconds !== null ? formatTrafficDuration(minGapSeconds) : "-",
      max_interval_seconds: maxGapSeconds,
      max_interval_formatted: maxGapSeconds !== null ? formatTrafficDuration(maxGapSeconds) : "-",
      peak_throughput_per_minute:
        peakBucket && intervalMinutes > 0
          ? Math.round((peakBucket.total_taps / intervalMinutes) * 10) / 10
          : 0,
    },
    peak_analysis: peakAnalysisTable,
    tap_logs: tapEvents.slice().reverse(),
  };
}

/**
 * Controller utama: Fetch data & Update DOM
 */
async function loadTrafficData() {
  const { selectedDate, selectedInterval, selectedMode } = window.trafficState;
  const apiBase = window.API_BASE || "";

  // Tampilkan loading indicators
  const peakBody = document.getElementById("trafPeakTableBody");
  const logBody = document.getElementById("trafLogsTableBody");
  if (peakBody && !window.trafficState.cachedData) {
    peakBody.innerHTML = `<tr><td colspan="8" class="traffic-empty-state"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><span class="ms-2">Menganalisis data traffic...</span></td></tr>`;
  }
  if (logBody && !window.trafficState.cachedData) {
    logBody.innerHTML = `<tr><td colspan="10" class="traffic-empty-state"><div class="spinner-border spinner-border-sm text-primary" role="status"></div><span class="ms-2">Memuat riwayat tap...</span></td></tr>`;
  }

  let resultData = null;

  try {
    // Coba endpoint backend khusus /traffic
    const url = `${apiBase}/api/v1/attendances/traffic?date=${selectedDate}&interval=${selectedInterval}&mode=${selectedMode}`;
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      if (json && json.success) {
        resultData = json;
      }
    }
  } catch (err) {
    console.warn("Endpoint traffic v1 belum aktif, beralih ke fallback komputasi:", err);
  }

  // Fallback: ambil semua attendances & hitung di sisi client
  if (!resultData) {
    try {
      const fallbackUrl = `${apiBase}/api/attendances`;
      const res = await fetch(fallbackUrl);
      const json = await res.json();
      const attendances = json?.data || [];
      resultData = calculateTrafficLocally(attendances, [], selectedDate, selectedInterval, selectedMode);
    } catch (e) {
      console.error("Gagal memuat fallback data absensi:", e);
    }
  }

  if (!resultData) {
    if (peakBody) {
      peakBody.innerHTML = `<tr><td colspan="8" class="traffic-empty-state text-danger"><i class="bi bi-exclamation-triangle"></i> Gagal memuat data traffic. Silahkan coba muat ulang.</td></tr>`;
    }
    if (logBody) {
      logBody.innerHTML = `<tr><td colspan="10" class="traffic-empty-state text-danger"><i class="bi bi-exclamation-triangle"></i> Gagal memuat log tap.</td></tr>`;
    }
    return;
  }

  window.trafficState.cachedData = resultData;
  renderTrafficViews(resultData);
}

/**
 * Render semua bagian tampilan setelah data diterima
 */
function renderTrafficViews(data) {
  const summary = data.summary || {};
  const peakTable = data.peak_analysis || [];
  const tapLogs = data.tap_logs || [];
  const searchQuery = (window.trafficState.searchQuery || "").toLowerCase().trim();

  // 1. Metric Cards
  const valTotalTaps = document.getElementById("traf-total-taps");
  const subTotalTaps = document.getElementById("traf-sub-taps");
  const valPeakRange = document.getElementById("traf-peak-range");
  const subPeakRange = document.getElementById("traf-peak-sub");
  const valAvgGap = document.getElementById("traf-avg-gap");
  const subAvgGap = document.getElementById("traf-avg-sub");
  const valMinMax = document.getElementById("traf-min-max-gap");
  const subRate = document.getElementById("traf-rate-sub");

  if (valTotalTaps) valTotalTaps.textContent = `${summary.total_taps || 0} Tap`;
  if (subTotalTaps) {
    subTotalTaps.textContent = `Tanggal: ${window.trafficState.selectedDate}`;
  }

  if (valPeakRange) {
    valPeakRange.textContent = summary.peak_time_range !== "-" ? summary.peak_time_range : "Belum Ada";
  }
  if (subPeakRange) {
    subPeakRange.innerHTML = summary.peak_taps > 0
      ? `<span class="badge bg-danger text-white"><i class="bi bi-fire"></i> ${summary.peak_taps} Tap (${summary.peak_percentage}%)</span>`
      : "Tidak ada tap di tanggal ini";
  }

  if (valAvgGap) {
    valAvgGap.textContent = summary.avg_interval_formatted || "-";
  }
  if (subAvgGap) {
    subAvgGap.textContent = summary.avg_interval_seconds
      ? `Rerata selisih antar kartu masuk`
      : "Belum cukup data interval";
  }

  if (valMinMax) {
    valMinMax.textContent = summary.min_interval_formatted && summary.max_interval_formatted
      ? `${summary.min_interval_formatted} / ${summary.max_interval_formatted}`
      : "-";
  }
  if (subRate) {
    subRate.textContent = summary.peak_throughput_per_minute > 0
      ? `Throughput: ~${summary.peak_throughput_per_minute} tap/mnt di jam puncak`
      : "Min / Max durasi jeda";
  }

  // 2. Timeline Mini Histogram
  const timelineContainer = document.getElementById("trafTimelineContainer");
  const timelineBar = document.getElementById("trafTimelineBar");
  if (timelineContainer && timelineBar) {
    if (peakTable.length > 0) {
      timelineContainer.style.display = "block";
      const maxTaps = Math.max(1, ...peakTable.map((p) => p.total_taps));
      timelineBar.innerHTML = peakTable
        .map((p) => {
          const heightPct = Math.max(12, Math.round((p.total_taps / maxTaps) * 100));
          return `
            <div class="timeline-slot ${p.is_peak ? "peak" : ""}" title="${p.time_range}: ${p.total_taps} tap (${p.percentage}%)">
              <div class="timeline-bar-col" style="height: ${heightPct}%;"></div>
              <span class="timeline-label">${p.time_range.split(" - ")[0]}</span>
            </div>
          `;
        })
        .join("");
    } else {
      timelineContainer.style.display = "none";
    }
  }

  // 3. Tabel Analisis Waktu Puncak
  const peakBody = document.getElementById("trafPeakTableBody");
  const intervalLabel = document.getElementById("trafIntervalLabel");
  if (intervalLabel) {
    intervalLabel.textContent = `${window.trafficState.selectedInterval} Menit`;
  }

  if (peakBody) {
    if (peakTable.length === 0) {
      peakBody.innerHTML = `
        <tr>
          <td colspan="8" class="traffic-empty-state">
            <i class="bi bi-clock-history"></i>
            <div>Tidak ada aktivitas tap kartu pada tanggal ini.</div>
          </td>
        </tr>
      `;
    } else {
      peakBody.innerHTML = peakTable
        .map((row) => {
          const isPeak = row.is_peak;
          const peakBadge = isPeak
            ? `<span class="badge-status badge-status-danger"><i class="bi bi-fire"></i> PUNCAK UTAMA</span>`
            : row.status_badge === "warning"
            ? `<span class="badge-status badge-status-warning"><i class="bi bi-people-fill"></i> Sangat Ramai</span>`
            : row.status_badge === "info"
            ? `<span class="badge-status badge-status-info"><i class="bi bi-person-fill"></i> Sedang</span>`
            : `<span class="badge-status badge-status-success"><i class="bi bi-check2"></i> Lengang</span>`;

          return `
            <tr class="${isPeak ? "peak-row" : ""}">
              <td class="fw-bold text-muted">${row.no}</td>
              <td>
                <span class="time-mono ${isPeak ? "text-danger fw-bold" : ""}">${row.time_range}</span>
                ${isPeak ? '<span class="badge bg-danger text-white ms-2">Rush Hour</span>' : ""}
              </td>
              <td class="text-center fw-bold">${row.total_taps}</td>
              <td class="text-center">
                <span class="time-mono">${row.avg_jeda_formatted}</span>
              </td>
              <td class="text-center">
                <span class="time-mono text-success">${row.min_jeda_formatted}</span>
              </td>
              <td class="text-center">
                <span class="time-mono text-muted">${row.max_jeda_formatted}</span>
              </td>
              <td>
                <div class="peak-progress-wrap">
                  <div class="peak-progress-bar">
                    <div class="peak-progress-fill ${isPeak ? "peak" : ""}" style="width: ${row.percentage}%;"></div>
                  </div>
                  <span class="peak-progress-text">${row.percentage}%</span>
                </div>
              </td>
              <td class="text-center">${peakBadge}</td>
            </tr>
          `;
        })
        .join("");
    }
  }

  // 4. Tabel Log Detail Traffic Tap Kartu
  const logBody = document.getElementById("trafLogsTableBody");
  const countPill = document.getElementById("trafLogCountPill");

  // Filter search
  const filteredLogs = tapLogs.filter((log) => {
    if (!searchQuery) return true;
    return (
      (log.username || "").toLowerCase().includes(searchQuery) ||
      String(log.nis || "").toLowerCase().includes(searchQuery) ||
      String(log.idcard || "").toLowerCase().includes(searchQuery) ||
      (log.rombel || "").toLowerCase().includes(searchQuery)
    );
  });

  if (countPill) {
    countPill.textContent = `${filteredLogs.length} Tap Ditampilkan`;
  }

  if (logBody) {
    if (filteredLogs.length === 0) {
      logBody.innerHTML = `
        <tr>
          <td colspan="10" class="traffic-empty-state">
            <i class="bi bi-inbox"></i>
            <div>${searchQuery ? "Tidak ada tap yang cocok dengan kata kunci pencarian." : "Belum ada riwayat tap kartu untuk tanggal ini."}</div>
          </td>
        </tr>
      `;
    } else {
      logBody.innerHTML = filteredLogs
        .map((log, index) => {
          const typeBadge = log.type === "keluar"
            ? `<span class="badge bg-info text-dark"><i class="bi bi-box-arrow-right"></i> Keluar</span>`
            : `<span class="badge bg-success"><i class="bi bi-box-arrow-in-right"></i> Masuk</span>`;

          const jedaHTML = getJedaBadgeHTML(log.jeda_seconds, log.jeda_badge === "first");

          return `
            <tr>
              <td class="text-muted small">${index + 1}</td>
              <td>
                <span class="time-mono">${log.time_wib || "-"}</span>
              </td>
              <td>
                ${jedaHTML}
              </td>
              <td class="fw-semibold">
                <i class="bi bi-person me-1 text-primary"></i> ${log.username || "Siswa"}
              </td>
              <td>
                <span class="badge bg-light text-dark border">${log.nis || "-"}</span>
              </td>
              <td>
                <span class="time-mono small text-secondary">${log.idcard || "-"}</span>
              </td>
              <td>
                <span>${log.rombel || "-"}</span>
              </td>
              <td class="text-center">${typeBadge}</td>
              <td class="small text-muted">${log.mac_address || "RFID Reader"}</td>
              <td class="text-center">
                <span class="badge bg-light text-secondary border">${log.status || "Hadir"}</span>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }
}

/**
 * Ekspor Data Traffic ke File CSV
 */
function exportTrafficToCSV() {
  const state = window.trafficState;
  const data = state.cachedData;
  if (!data || !data.tap_logs || data.tap_logs.length === 0) {
    alert("Tidak ada data tap untuk diekspor!");
    return;
  }

  let csv = "\uFEFF"; // UTF-8 BOM untuk Excel
  csv += `LAPORAN TRAFFIC TAP KARTU & ANALISIS JAM PUNCAK SCANGO\n`;
  csv += `Tanggal: ${state.selectedDate}\n`;
  csv += `Total Tap: ${data.summary?.total_taps || 0}\n`;
  csv += `Waktu Puncak Absensi: ${data.summary?.peak_time_range || "-"}\n`;
  csv += `Rata-rata Jeda Antar Tap: ${data.summary?.avg_interval_formatted || "-"}\n\n`;

  // Bagian 1: Analisis Jam Puncak
  csv += `TABEL 1: ANALISIS WAKTU PUNCAK ABSENSI\n`;
  csv += `No,Rentang Jam,Total Tap,Rata-rata Jeda,Jeda Tercepat,Jeda Terlama,Persentase,Status Kepadatan\n`;
  (data.peak_analysis || []).forEach((row) => {
    csv += `"${row.no}","${row.time_range}","${row.total_taps}","${row.avg_jeda_formatted}","${row.min_jeda_formatted}","${row.max_jeda_formatted}","${row.percentage}%","${row.status}"\n`;
  });

  csv += `\nTABEL 2: LOG RIWAYAT TAP KARTU BERURUTAN\n`;
  csv += `No,Waktu Tap WIB,Jeda Detik,Jeda Format,Nama Siswa,NIS,RFID IDCard,Rombel,Tipe Tap,Reader,Status\n`;
  (data.tap_logs || []).forEach((log, idx) => {
    csv += `"${idx + 1}","${log.time_wib || "-"}","${log.jeda_seconds ?? "-"}","${log.jeda_formatted || "-"}","${log.username || "-"}","${log.nis || "-"}","${log.idcard || "-"}","${log.rombel || "-"}","${log.type_label || log.type}","${log.mac_address || "-"}","${log.status || "-"}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Traffic_Tap_Kartu_${state.selectedDate}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Event Listener & Clock Initializer
 */
function initTrafficListener() {
  // 1. Clock in Header Panel
  const timeEl = document.getElementById("time");
  const dateEl = document.getElementById("date");

  function updateTrafficClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    if (timeEl) timeEl.textContent = `${hh}:${mm}:${ss} WIB`;

    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }

  if (window.trafficState.clockTimer) {
    clearInterval(window.trafficState.clockTimer);
  }
  updateTrafficClock();
  window.trafficState.clockTimer = setInterval(updateTrafficClock, 1000);

  // 2. Element references
  const filterDate = document.getElementById("trafFilterDate");
  const filterInterval = document.getElementById("trafFilterInterval");
  const filterMode = document.getElementById("trafFilterMode");
  const searchInput = document.getElementById("trafSearchInput");
  const refreshBtn = document.getElementById("trafRefreshBtn");
  const liveToggle = document.getElementById("trafLiveToggle");
  const liveLabel = document.getElementById("trafLiveLabel");
  const exportBtn = document.getElementById("trafExportBtn");

  // Sync state values ke form input
  if (filterDate) filterDate.value = window.trafficState.selectedDate;
  if (filterInterval) filterInterval.value = String(window.trafficState.selectedInterval);
  if (filterMode) filterMode.value = window.trafficState.selectedMode;
  if (searchInput) searchInput.value = window.trafficState.searchQuery;

  // 3. Event Listeners
  if (filterDate) {
    filterDate.addEventListener("change", (e) => {
      window.trafficState.selectedDate = e.target.value;
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (filterInterval) {
    filterInterval.addEventListener("change", (e) => {
      window.trafficState.selectedInterval = parseInt(e.target.value, 10) || 30;
      loadTrafficData();
    });
  }

  if (filterMode) {
    filterMode.addEventListener("change", (e) => {
      window.trafficState.selectedMode = e.target.value;
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      window.trafficState.searchQuery = e.target.value;
      if (window.trafficState.cachedData) {
        renderTrafficViews(window.trafficState.cachedData);
      }
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      window.trafficState.cachedData = null;
      loadTrafficData();
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener("click", exportTrafficToCSV);
  }

  // 4. Live Mode Auto Refresh
  if (liveToggle) {
    liveToggle.addEventListener("click", () => {
      window.trafficState.isLive = !window.trafficState.isLive;
      if (window.trafficState.isLive) {
        liveToggle.classList.add("active");
        if (liveLabel) liveLabel.textContent = "Live Sync: On";
        // Jalankan polling setiap 10 detik
        if (window.trafficState.liveTimer) clearInterval(window.trafficState.liveTimer);
        window.trafficState.liveTimer = setInterval(() => {
          loadTrafficData();
        }, 10000);
      } else {
        liveToggle.classList.remove("active");
        if (liveLabel) liveLabel.textContent = "Live Sync: Off";
        if (window.trafficState.liveTimer) {
          clearInterval(window.trafficState.liveTimer);
          window.trafficState.liveTimer = null;
        }
      }
    });
  }

  // 5. Initial fetch
  loadTrafficData();
}

// Pastikan fungsi terdaftar di window object
window.renderTraffic = renderTraffic;
window.initTrafficListener = initTrafficListener;

// Auto-render saat halaman traffic dibuka langsung (bukan via SPA router)
document.addEventListener("DOMContentLoaded", function () {
  const content = document.getElementById("content");
  if (content && typeof renderTraffic === "function" && !content.dataset.rendered) {
    content.innerHTML = renderTraffic();
    content.dataset.rendered = "1";
    if (typeof initTrafficListener === "function") initTrafficListener();
  }
});