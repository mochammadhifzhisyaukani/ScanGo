function renderGrafik() {
  return `
  <div class="header-nav-tabs justify-content-center">
                    <a href="#" class="nav-tab-item active">PPLG X-1</a>
                    <a href="#" class="nav-tab-item">PPLG X-2</a>
                    <a href="#" class="nav-tab-item">PPLG X-3</a>
                    <a href="#" class="nav-tab-item">PPLG X-4</a>
                    <a href="#" class="nav-tab-item">PPLG X-5</a>
                </div>

                <div class="teacher-schedule">
                    <div class="teacher-schedule-header">
                        <i class="bi bi-person-workspace"></i>
                        <span>Guru Mengajar Hari Ini</span>
                    </div>

                    <div class="teacher-list">
                        <div class="teacher-item">
                            <div class="teacher-avatar">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <div class="teacher-info">
                                <div class="teacher-name">Pak Iqbal Fajar Syahbana</div>
                                <div class="teacher-subject">
                                    Pemrograman Dasar • 07:00 - 10:00
                                </div>
                            </div>
                        </div>

                        <div class="teacher-item">
                            <div class="teacher-avatar">
                                <i class="bi bi-person-fill"></i>
                            </div>
                            <div class="teacher-info">
                                <div class="teacher-name">Bu Duma dianis sari siregar</div>
                                <div class="teacher-subject">
                                    Basis Data • 10:15 - 12:30
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="wrap">
                    <div class="summary">
                        <div class="scard">
                            <div class="icon-box" style="background:#EEF2FF;color:#4F46E5;"><i
                                    class="bi bi-people-fill"></i></div>
                            <div>
                                <div class="value" id="val-total-siswa">-</div>
                                <div class="label">Total Siswa</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#DCFCE7;color:#16A34A;"><i
                                    class="bi bi-check-circle-fill"></i></div>
                            <div>
                                <div class="value" id="val-hadir">-</div>
                                <div class="label">Hadir Hari Ini</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#DBEAFE;color:#2563EB;"><i
                                    class="bi bi-heart-pulse-fill"></i></div>
                            <div>
                                <div class="value" id="val-sakit">-</div>
                                <div class="label">Sakit</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#F3E8FF;color:#7C3AED;"><i
                                    class="bi bi-file-earmark-text-fill"></i></div>
                            <div>
                                <div class="value" id="val-izin">-</div>
                                <div class="label">Izin</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#FEF3C7;color:#D97706;"><i
                                    class="bi bi-clock-fill"></i></div>
                            <div>
                                <div class="value" id="val-terlambat">-</div>
                                <div class="label">Terlambat</div>
                            </div>
                        </div>

                        <div class="scard">
                            <div class="icon-box" style="background:#FEE2E2;color:#DC2626;"><i
                                    class="bi bi-x-circle-fill"></i></div>
                            <div>
                                <div class="value" id="val-belum-absen">-</div>
                                <div class="label">Belum Absen</div>
                            </div>
                        </div>
                    </div>

                    <div class="grid">
                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Kehadiran 7 Hari Terakhir</h3>
                                    <p>Jumlah siswa hadir per hari</p>
                                </div>
                                <div style="display:flex;gap:8px;align-items:center;">
                                    <span class="filterpill"
                                        style="background:var(--green-soft);color:var(--green);border-color:transparent;">Hari
                                        Ini · 87.4%</span>
                                    <span class="filterpill">7 Hari</span>
                                </div>
                            </div>

                            <div class="chart-box tall" id="trendChart"></div>
                            <div class="delta-row" id="deltaRow"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Distribusi Status</h3>
                                    <p>Komposisi hari ini</p>
                                </div>
                            </div>
                            <div class="donut-wrap" id="donutChart">
                                <div class="donut-center">
                                    <div class="big">168</div>
                                    <div class="small">total siswa</div>
                                </div>
                            </div>
                            <div class="legend-row">
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--green)"></span>Tepat Waktu</span><span
                                        class="v">120</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--blue)"></span>Sakit</span><span class="v">15</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--purple)"></span>Izin</span><span class="v">25</span>
                                </div>
                                <div class="legend-item"><span class="l"><span class="dot"
                                            style="background:var(--red)"></span>Tidak Hadir</span><span
                                        class="v">8</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- row 2: absent today list + tap-in time histogram -->
                    <div class="grid3">
                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Tidak Hadir Hari Ini</h3>
                                    <p>Siswa yang tidak tap masuk hari ini</p>
                                </div>
                                <span class="filterpill" id="absentCountPill">0 siswa</span>
                            </div>
                            <div class="rank-list" id="absentList"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Distribusi Jam Tap-in</h3>
                                    <p>Jam masuk mulai 07:00 — batas tepat waktu 07:30</p>
                                </div>
                            </div>
                            <div class="chart-box" id="timeChart"></div>
                        </div>
                    </div>

                    <!-- row 3: today's check-in status list + ranking -->
                    <div class="grid">
                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Status Tap Hari Ini</h3>
                                    <p>Belum tap diprioritaskan di atas</p>
                                </div>
                                <span class="filterpill" id="belumCountPill">0 belum</span>
                            </div>
                            <div class="rank-list" id="statusList"></div>
                        </div>

                        <div class="panel">
                            <div class="panel-head">
                                <div>
                                    <h3>Perlu Perhatian</h3>
                                    <p>Sering terlambat / tidak hadir bulan ini</p>
                                </div>
                                <span class="filterpill" id="perhatianCountPill"
                                    style="background:var(--purple-soft);color:var(--purple);border-color:transparent;">0
                                    siswa</span>
                            </div>
                            <div class="rank-list" id="perhatianList">
                                <!-- list dikosongkan jika belum cukup data -->
                            </div>
                        </div>
                    </div>

                </div>
  `;
}
let clockInterval = null;

function initDashboardListener() {
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

  // Perbaikan validasi interval biar gak bikin crash kodingan di bawahnya
  if (typeof clockInterval !== "undefined" && clockInterval !== null) {
    clearInterval(clockInterval);
  }

  updateClock();
  clockInterval = setInterval(updateClock, 1000);

  // Jalankan inisialisasi tab kelas
  if (typeof initTabs === 'function') {
    initTabs();
  }
}

function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab-item');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

//dasborad statistik
// ===================== helpers =====================
const NS = "http://www.w3.org/2000/svg";
function svgEl(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
}
function makeTooltip(container) {
  const tip = document.createElement("div");
  tip.className = "ctip";
  container.appendChild(tip);
  return tip;
}
function showTip(tip, container, x, y, html) {
  tip.innerHTML = html;
  tip.style.left = x + "px";
  tip.style.top = y - 10 + "px";
  tip.style.opacity = 1;
}
function hideTip(tip) {
  tip.style.opacity = 0;
}

// VW/VH = virtual viewbox units, stretched to fill container (preserveAspectRatio none)
const VW = 1000,
  VH = 400;
const PAD = { l: 34, r: 14, t: 18, b: 28 };

function scaleX(i, n) {
  return PAD.l + (i / (n - 1)) * (VW - PAD.l - PAD.r);
}
function scaleY(v, max) {
  return VH - PAD.b - (v / max) * (VH - PAD.t - PAD.b);
}

function gridLines(svg, max, steps) {
  for (let i = 0; i <= steps; i++) {
    const v = (max / steps) * i;
    const y = scaleY(v, max);
    svg.appendChild(
      svgEl("line", {
        x1: PAD.l,
        x2: VW - PAD.r,
        y1: y,
        y2: y,
        stroke: "#ECEEF3",
        "stroke-width": 1,
      }),
    );
  }
}

// ===================== 1. Kehadiran 7 Hari Terakhir (single line) =====================
window.initGrafikListerner = async function () {
  initDashboardListener();

  let users = [];
  let attendances = [];
  try {
    const resA = await fetch("http://localhost:3000/api/attendances");
    if (resA.ok) {
      const dataA = await resA.json();
      if (dataA.success) attendances = dataA.data || [];
    }
    const resU = await fetch("http://localhost:3000/api/users");
    if (resU.ok) {
      const dataU = await resU.json();
      if (dataU.success) users = dataU.data || [];
    }
  } catch (error) {
    console.error("Gagal memuat data statistik", error);
  }

  const td = new Date();
  const todayAtt = attendances.filter(a => {
      if(!a.created_at) return false;
      const d = new Date(a.created_at);
      return d.getFullYear() === td.getFullYear() && d.getMonth() === td.getMonth() && d.getDate() === td.getDate();
  });
  
  const totalSiswa = users.length;
  const hadirMap = new Map();
  todayAtt.forEach(a => {
      let cId = String(a.idcard || '').trim();
      if(cId) {
          if(!hadirMap.has(cId)) {
              hadirMap.set(cId, a);
          } else {
              const existing = hadirMap.get(cId);
              if (new Date(a.created_at) > new Date(existing.created_at)) {
                  hadirMap.set(cId, a);
              }
          }
      }
  });
  const hadirCards = Array.from(hadirMap.keys());
  const totalHadir = hadirCards.length;
  const totalBelum = Math.max(0, totalSiswa - totalHadir);

  // Data List Siswa (Status Hari Ini) & Menghitung Terlambat
  const studentsList = [];
  const absentList = [];
  let countTepat = 0;
  let countTerlambat = 0;
  
  users.forEach(u => {
     let uId = String(u.idcard || '').trim();
     if(uId && hadirMap.has(uId)) {
         let timeStr = "00:00";
         let isTerlambat = false;
         const attObj = hadirMap.get(uId);
         if(attObj && attObj.created_at) {
             const dtt = new Date(attObj.created_at);
             const hrs = dtt.getHours();
             const mins = dtt.getMinutes();
             if (hrs > 8 || (hrs === 8 && mins > 30)) {
                 isTerlambat = true;
             }
             timeStr = String(hrs).padStart(2,'0') + ':' + String(mins).padStart(2,'0');
         }
         if (isTerlambat) countTerlambat++;
         else countTepat++;

         studentsList.push({ name: u.username, rombel: u.rombel, status: isTerlambat ? "terlambat" : "sudah", time: timeStr });
     } else {
         studentsList.push({ name: u.username, rombel: u.rombel, status: "belum" });
         absentList.push({ name: u.username, rombel: u.rombel, status: "Tidak Hadir" });
     }
  });

  const valTotal = document.getElementById("val-total-siswa"); if (valTotal) valTotal.innerText = totalSiswa;
  const valHadir = document.getElementById("val-hadir"); if (valHadir) valHadir.innerText = totalHadir;
  const valSakit = document.getElementById("val-sakit"); if (valSakit) valSakit.innerText = "0"; 
  const valIzin = document.getElementById("val-izin"); if (valIzin) valIzin.innerText = "0";
  const valTerlambat = document.getElementById("val-terlambat"); if (valTerlambat) valTerlambat.innerText = countTerlambat;
  const valBelum = document.getElementById("val-belum-absen"); if (valBelum) valBelum.innerText = totalBelum;

  // Data Kehadiran 7 Hari
  const trendLabels = [];
  const trendLabelsShort = [];
  const trendData = [];
  for(let i=6; i>=0; i--) {
     const d = new Date();
     d.setDate(d.getDate() - i);
     const dmy = d.toLocaleDateString("id-ID", {weekday:"short", day:"numeric", month:"short"});
     trendLabelsShort.push(dmy.split(',')[0]);
     trendLabels.push(dmy);
     
     const atts = attendances.filter(a => {
        if(!a.created_at) return false;
        const ad = new Date(a.created_at);
        return ad.getFullYear() === d.getFullYear() && ad.getMonth() === d.getMonth() && ad.getDate() === d.getDate();
     });
     const unique = new Set(atts.map(a => String(a.idcard).trim())).size;
     trendData.push(unique || 0);
  }

  // Data Distribusi Status (Donut)
  const donutData = [
     { label: "Tepat Waktu", value: countTepat, color: "#1FA871" },
     { label: "Terlambat", value: countTerlambat, color: "#EAB308" },
     { label: "Sakit/Izin", value: 0, color: "#3FA9E0" },
     { label: "Tidak Hadir", value: totalBelum, color: "#E25C5C" }
  ];

  // Jam Tap-in
  const nowHrs = new Date().getHours(); 
  const tLabels = [];
  const startHr = nowHrs - 7;
  for(let i=0; i<8; i++) {
      let h = startHr + i;
      let label = "";
      if (h < 0) label = "<00:00"; 
      else label = String(h).padStart(2,'0') + ":00";
      tLabels.push(label);
  }
  
  let tBins = [0,0,0,0,0,0,0,0];
  Array.from(hadirMap.values()).forEach(a => {
     if(a.created_at) {
         const hrs = new Date(a.created_at).getHours();
         let binIdx = hrs - startHr;
         if (binIdx < 0) binIdx = 0;
         if (binIdx > 7) binIdx = 7;
         tBins[binIdx]++;
     }
  });

  // ===================== 1. Kehadiran 7 Hari Terakhir (single line) =====================
  (function () {
    const labels = trendLabels;
    const labelsShort = trendLabelsShort;
    const data = trendData;
    const max = Math.max(50, ...data) + 10;
    const n = data.length;

    const box = document.getElementById("trendChart");
    if (!box) return;
    box.innerHTML = '';
    const svg = svgEl("svg", {
      viewBox: `0 0 ${VW} ${VH}`,
      preserveAspectRatio: "none",
    });
    box.appendChild(svg);
    gridLines(svg, max, 4);

    const pts = data.map((v, i) => [scaleX(i, n), scaleY(v, max)]);

    // area fill
    let areaD = `M ${pts[0][0]} ${VH - PAD.b} `;
    pts.forEach((p) => (areaD += `L ${p[0]} ${p[1]} `));
    areaD += `L ${pts[n - 1][0]} ${VH - PAD.b} Z`;
    const grad = svgEl("linearGradient", {
      id: "trendGrad",
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 1,
    });
    grad.appendChild(
      svgEl("stop", {
        offset: "0%",
        "stop-color": "#4F5AED",
        "stop-opacity": 0.16,
      }),
    );
    grad.appendChild(
      svgEl("stop", {
        offset: "100%",
        "stop-color": "#4F5AED",
        "stop-opacity": 0,
      }),
    );
    const defs = svgEl("defs", {});
    defs.appendChild(grad);
    svg.appendChild(defs);
    svg.appendChild(
      svgEl("path", { d: areaD, fill: "url(#trendGrad)", stroke: "none" }),
    );

    // line
    let lineD = `M ${pts[0][0]} ${pts[0][1]} `;
    pts.forEach((p, i) => {
      if (i > 0) lineD += `L ${p[0]} ${p[1]} `;
    });
    svg.appendChild(
      svgEl("path", {
        d: lineD,
        fill: "none",
        stroke: "#4F5AED",
        "stroke-width": 3,
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    );

    // points + hover targets
    const tip = makeTooltip(box);
    pts.forEach((p, i) => {
      const c = svgEl("circle", {
        cx: p[0],
        cy: p[1],
        r: 5,
        fill: "#fff",
        stroke: "#4F5AED",
        "stroke-width": 2,
      });
      svg.appendChild(c);
      const hit = svgEl("circle", {
        cx: p[0],
        cy: p[1],
        r: 16,
        fill: "transparent",
      });
      hit.addEventListener("mouseenter", () => {
        c.setAttribute("r", 7);
        showTip(
          tip,
          box,
          (p[0] / VW) * box.clientWidth,
          (p[1] / VH) * box.clientHeight,
          `<div class="tt-title">${labels[i]}</div><div class="tt-row"><span class="sw" style="background:#4F5AED"></span>Hadir: ${data[i]} siswa</div>`,
        );
      });
      hit.addEventListener("mouseleave", () => {
        c.setAttribute("r", 5);
        hideTip(tip);
      });
      svg.appendChild(hit);
    });

    // x labels
    labelsShort.forEach((lab, i) => {
      const t = svgEl("text", {
        x: pts[i][0],
        y: VH - 8,
        "text-anchor": "middle",
        "font-size": 12,
        fill: "#6B7280",
        "font-weight": 600,
      });
      t.textContent = lab;
      svg.appendChild(t);
    });

    // delta chips
    const deltaRow = document.getElementById("deltaRow");
    if (deltaRow) {
      deltaRow.innerHTML = '';
      data.forEach((val, i) => {
        const item = document.createElement("div");
        item.className = "delta-item";
        let chipHtml;
        if (i === 0) {
          chipHtml = `<span class="chip flat">awal</span>`;
        } else {
          const diff = val - data[i - 1];
          if (diff > 0) chipHtml = `<span class="chip up">▲ ${diff}</span>`;
          else if (diff < 0)
            chipHtml = `<span class="chip down">▼ ${Math.abs(diff)}</span>`;
          else chipHtml = `<span class="chip flat">tetap</span>`;
        }
        item.innerHTML = `<div class="dd">${labelsShort[i]}</div><div class="dv">${val}</div>${chipHtml}`;
        deltaRow.appendChild(item);
      });
    }
  })();

  // ===================== 2. Donut Distribusi Status =====================
  (function () {
    const data = donutData;
    const total = data.reduce((a, b) => a + b.value, 0) || 1; // avg divide by 0
    const box = document.getElementById("donutChart");
    if (!box) return;

    // clean old svg
    const oldSvg = box.querySelector('svg');
    if (oldSvg) oldSvg.remove();

    const size = 180,
      r = 70,
      cx = size / 2,
      cy = size / 2,
      sw = 22;
    const svg = svgEl("svg", {
      viewBox: `0 0 ${size} ${size}`,
      width: size,
      height: size,
      style: "position:relative;z-index:1;",
    });
    box.insertBefore(svg, box.firstChild);

    // update labels dynamically
    const dc = box.querySelector('.donut-center .big');
    if(dc) dc.textContent = totalSiswa;

    const tip = makeTooltip(box);
    let startAngle = -90;
    const circumference = 2 * Math.PI * r;
    data.forEach((seg) => {
      const frac = seg.value / total;
      const dash = frac * circumference;
      const gap = circumference - dash;
      if (seg.value === 0) return; // don't draw 0 path
      const path = svgEl("circle", {
        cx,
        cy,
        r,
        fill: "none",
        stroke: seg.color,
        "stroke-width": sw,
        "stroke-dasharray": `${dash} ${gap}`,
        "stroke-dashoffset": -((startAngle + 90) / 360) * circumference,
        transform: `rotate(-90 ${cx} ${cy})`,
      });
      path.style.cursor = "pointer";
      path.addEventListener("mouseenter", (e) => {
        path.setAttribute("stroke-width", sw + 4);
        const pct = Math.round(frac * 100);
        showTip(
          tip,
          box,
          size / 2,
          size / 2 - r - 6,
          `<div class="tt-title">${seg.label}</div><div class="tt-row"><span class="sw" style="background:${seg.color}"></span>${seg.value} siswa (${pct}%)</div>`,
        );
      });
      path.addEventListener("mouseleave", () => {
        path.setAttribute("stroke-width", sw);
        hideTip(tip);
      });
      svg.appendChild(path);
      startAngle += frac * 360;
    });

    // Update legends
    const legendRow = box.nextElementSibling;
    if (legendRow && legendRow.classList.contains("legend-row")) {
       legendRow.innerHTML = `
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--green)"></span>Tepat Waktu</span><span class="v">${countTepat}</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:#EAB308"></span>Terlambat</span><span class="v">${countTerlambat}</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--purple)"></span>Sakit/Izin</span><span class="v">0</span></div>
          <div class="legend-item"><span class="l"><span class="dot" style="background:var(--red)"></span>Tidak Hadir</span><span class="v">${totalBelum}</span></div>
       `;
    }
  })();

  // ===================== 3. Tidak Hadir Hari Ini (list: foto, nama, rombel, status) =====================
  (function () {
    const absentStudents = absentList;
    const tagClass = { "Tidak Hadir": "absent", Sakit: "sakit", Izin: "izin" };

    const list = document.getElementById("absentList");
    const countPill = document.getElementById("absentCountPill");
    if(!list) return;
    list.innerHTML = "";
    absentStudents.forEach((s) => {
      const row = document.createElement("div");
      row.className = "rank-item";
      row.innerHTML = `
      <div class="avatar"></div>
      <div class="rank-info"><div class="nm">${s.name}</div><div class="rb">${s.rombel || '-'}</div></div>
      <span class="rank-tag ${tagClass[s.status]}">${s.status}</span>`;
      list.appendChild(row);
    });
    if(countPill) countPill.textContent = absentStudents.length + " siswa";
  })();

  // ===================== 4. Status Tap Hari Ini (list: belum di atas, sudah di bawah) =====================
  (function () {
    const students = studentsList;
    // belum absen diprioritaskan di atas, lalu terlambat, lalu sudah
    students.sort((a, b) => {
      const rank = { "belum": 1, "terlambat": 2, "sudah": 3 };
      if (rank[a.status] === rank[b.status]) return 0;
      return rank[a.status] < rank[b.status] ? -1 : 1;
    });

    const list = document.getElementById("statusList");
    if(!list) return;
    list.innerHTML = "";
    students.forEach((s) => {
      const row = document.createElement("div");
      row.className = "rank-item";
      const tag =
        s.status === "belum"
          ? `<span class="rank-tag belum">Belum Tap</span>`
          : s.status === "terlambat"
          ? `<span class="rank-tag late">Sudah (Terlambat) · ${s.time}</span>`
          : `<span class="rank-tag sudah">Sudah · ${s.time}</span>`;
      row.innerHTML = `
      <div class="avatar"></div>
      <div class="rank-info"><div class="nm">${s.name}</div><div class="rb">${s.rombel || '-'}</div></div>
      ${tag}`;
      list.appendChild(row);
    });
    const belumCount = students.filter((s) => s.status === "belum").length;
    const dp = document.getElementById("belumCountPill");
    if(dp) dp.textContent = belumCount + " belum";
  })();

  // ===================== 4. Distribusi Jam Tap-in (bar) =====================
  (function () {
    const labels = tLabels;
    const data = tBins; // Dynamic Tbins
    const max = Math.max(10, ...data) + 5;
    const n = data.length;

    const box = document.getElementById("timeChart");
    const svg = svgEl("svg", {
      viewBox: `0 0 ${VW} ${VH}`,
      preserveAspectRatio: "none",
    });
    box.appendChild(svg);
    gridLines(svg, max, 4);

    const slotW = (VW - PAD.l - PAD.r) / n;
    const barW = slotW * 0.55;
    const tip = makeTooltip(box);

    data.forEach((v, i) => {
      const cx = PAD.l + slotW * (i + 0.5);
      const y = scaleY(v, max);
      const color = i <= 3 ? "#4F5AED" : "#F0973C";
      const bar = svgEl("rect", {
        x: cx - barW / 2,
        y,
        width: barW,
        height: VH - PAD.b - y,
        rx: 6,
        fill: color,
      });
      svg.appendChild(bar);

      const hit = svgEl("rect", {
        x: cx - slotW / 2,
        y: PAD.t,
        width: slotW,
        height: VH - PAD.b - PAD.t,
        fill: "transparent",
      });
      hit.addEventListener("mouseenter", () => {
        bar.setAttribute("opacity", 0.75);
        showTip(
          tip,
          box,
          (cx / VW) * box.clientWidth,
          (y / VH) * box.clientHeight,
          `<div class="tt-title">${labels[i]}</div><div class="tt-row"><span class="sw" style="background:${color}"></span>${v} siswa</div>`,
        );
      });
      hit.addEventListener("mouseleave", () => {
        bar.setAttribute("opacity", 1);
        hideTip(tip);
      });
      svg.appendChild(hit);

      const t = svgEl("text", {
        x: cx,
        y: VH - 8,
        "text-anchor": "middle",
        "font-size": 11,
        fill: "#6B7280",
        "font-weight": 600,
      });
      t.textContent = labels[i];
      svg.appendChild(t);
    });
  })();
};
