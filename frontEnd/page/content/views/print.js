// Daftar rombel disamakan dengan pilihan di inputStudent.js
const ROMBEL_GROUPS_PRINT = [
  ["TEACHER", ["Guru Produktif"]],
  ["PPLG", ["PPLG 1", "PPLG 2", "PPLG 3", "PPLG 4", "PPLG 5"]],
  ["TJKT", ["TJKT 1", "TJKT 2", "TJKT 3", "TJKT 4", "TJKT 5"]],
  ["DKV", ["DKV 1", "DKV 2", "DKV 3", "DKV 4", "DKV 5"]],
  ["KLN", ["Kuliner 1", "Kuliner 2", "Kuliner 3", "Kuliner 4", "Kuliner 5"]],
  ["HTL", ["Hotel 1", "Hotel 2", "Hotel 3", "Hotel 4", "Hotel 5"]],
  [
    "PMN",
    ["Pemasaran 1", "Pemasaran 2", "Pemasaran 3", "Pemasaran 4", "Pemasaran 5"],
  ],
];

const RAYON_MAP_PRINT = {
  cic: "Cicurug",
  cis: "Cisarua",
  cib: "Cibedug",
  suk: "Sukasari",
  cia: "Ciawi",
  taj: "Tajur",
  wik: "Wikrama",
};

function formatRayonPrint(value) {
  const v = String(value || "").trim();
  const m = v.match(/^([a-zA-Z]+)(\d+)$/);
  if (!m) return v || "-";
  const nama = RAYON_MAP_PRINT[m[1].toLowerCase()];
  return nama ? `${nama} ${parseInt(m[2], 10)}` : v;
}

function normalizeRombelPrint(value) {
  return String(value || "")
    .trim()
    .toUpperCase();
}

function buildRombelOptionsPrint() {
  return ROMBEL_GROUPS_PRINT.map(([label, items]) => {
    const options = items
      .map((val) => `<option value="${val}">${val}</option>`)
      .join("");
    return `<optgroup label="${label}">${options}</optgroup>`;
  }).join("");
}

// Konversi timestamp ke tanggal lokal format YYYY-MM-DD
function toLocalDateStr(timestamp) {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("sv-SE");
}

function renderPrint() {
  const currentMonth = new Date().toISOString().substring(0, 7);
  return `
        <div class="print-container animate__animated animate__fadeIn mt-4" style="padding: 20px;">
        <div class="data-card p-4" style="max-width: 100%; margin: 0 auto; background: var(--bg-sidebar); color: var(--color-teks) !important; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div class="text-center mb-4">
                <h3 class="fw-bold mt-2" style="color: var(--color-teks);">Cetak Rekapitulasi Absensi</h3>
                <p style="font-size: 0.9rem; color: var(--color-teks);">Unduh laporan absensi siswa dalam format Excel/PDF</p>
            </div>
            
            <hr class="mb-4">

            <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; color: var(--color-teks);">Pilih Kelas</label>
                <select id="printKelas" class="form-select bg-light border-0 rounded-3" style="height: 40px; font-size: 0.9rem;">
                    <option value="">Semua Kelas</option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; color: var(--color-teks);">Pilih Rombel</label>
                <select id="printRombel" class="form-select bg-light border-0 rounded-3" style="height: 40px; font-size: 0.9rem;">
                    ${buildRombelOptionsPrint()}
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; color: var(--color-teks);">Jenis Rekapitulasi</label>
                <div class="d-flex gap-4 mt-1">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="jenisRekap" id="rekapMingguan" value="mingguan" checked>
                        <label class="form-check-label" for="rekapMingguan" style="color: var(--color-teks);">Minggu Ini</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="jenisRekap" id="rekapBulanan" value="bulanan">
                        <label class="form-check-label" for="rekapBulanan" style="color: var(--color-teks);">Bulan Ini</label>
                    </div>
                </div>
            </div>

            <div class="mb-4" id="boxPilihanBulan" style="display: none;">
                <label class="form-label fw-semibold" style="font-size: 0.85rem; color: var(--color-teks);">Pilih Bulan & Tahun</label>
                <input type="month" id="printBulan" class="form-control bg-light border-0 rounded-3" style="height: 40px;" value="${currentMonth}">
            </div>

            <div class="mb-3">
  <label class="form-label fw-semibold" style="color: var(--color-teks);">
    Format Laporan
  </label>

  <select
    id="printFormat"
    class="form-select bg-light border-0 rounded-3"
    style="height: 40px;"
  >
    <option value="">-- Pilih Format --</option>
    <option value="pdf">📄 PDF</option>
    <option value="excel">📊 Excel</option>
  </select>
</div>

<button
  id="btnPreviewCetak"
  class="btn w-100 rounded-3"
  style="
    height: 42px;
    font-weight: 500;
    background: linear-gradient(135deg, #4f46e5, #6366f1);
    border: none;
    color: white;
  "
>
  <i class="bi bi-eye"></i>
  Tampilkan Preview
</button>
        </div>
    </div>
    
    
    <div
  id="previewRekap"
  style="
    display: none;
    max-width: 100%;
    margin: 20px auto 0;
  "></div>
`;
}
function initPrint() {
  const radioMingguan = document.getElementById("rekapMingguan");
  const radioBulanan = document.getElementById("rekapBulanan");
  const boxPilihanBulan = document.getElementById("boxPilihanBulan");

  const printKelas = document.getElementById("printKelas");
  const printRombel = document.getElementById("printRombel");

  const printFormat = document.getElementById("printFormat");
  const btnPreviewCetak = document.getElementById("btnPreviewCetak");
  const previewRekap = document.getElementById("previewRekap");

  if (
    !radioMingguan ||
    !radioBulanan ||
    !boxPilihanBulan ||
    !printKelas ||
    !printRombel ||
    !printFormat ||
    !btnPreviewCetak ||
    !previewRekap
  ) {
    return;
  }

  // ================================
  // PILIH JENIS REKAP
  // ================================

  radioMingguan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "none";
  });

  radioBulanan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "block";
  });

  // ================================
  // AMBIL DATA SISWA
  // ================================

  async function prosesDataSiswa() {
    const rombelTerpilih = printRombel.value;
    const rombelLabel =
      printRombel.options[printRombel.selectedIndex]?.text || rombelTerpilih;
    const kelasTerpilih = printKelas.value;
    const kelasLabel = kelasTerpilih
      ? printKelas.options[printKelas.selectedIndex]?.text ||
        `Kelas ${kelasTerpilih}`
      : "";

    const jenisLaporan = document.querySelector(
      'input[name="jenisRekap"]:checked',
    ).value;

    const semuaData = await fetchAttendanceData();

    let dataRombel = semuaData.filter((row) => {
      if (!row.created_at) return false;

      if (
        kelasTerpilih &&
        String(row.kelas || "")
          .trim()
          .toUpperCase() !== String(kelasTerpilih).toUpperCase()
      ) {
        return false;
      }

      return (
        normalizeRombelPrint(row.rombel) ===
        normalizeRombelPrint(rombelTerpilih)
      );
    });

    const hariIni = new Date();

    // ================================
    // MINGGUAN
    // ================================

    if (jenisLaporan === "mingguan") {
      const jarakKeSenin = hariIni.getDay() === 0 ? 6 : hariIni.getDay() - 1;

      const senin = new Date(hariIni);

      senin.setDate(hariIni.getDate() - jarakKeSenin);

      // Akhir pekan: Minggu (senin + 6) agar absen Sabtu/Minggu tetap terhitung
      const akhirPekan = new Date(senin);

      akhirPekan.setDate(senin.getDate() + 6);

      const startStr = senin.toLocaleDateString("sv-SE");

      const endStr = akhirPekan.toLocaleDateString("sv-SE");

      dataRombel = dataRombel.filter((row) => {
        const tgl = toLocalDateStr(row.created_at);
        return tgl >= startStr && tgl <= endStr;
      });
    } else {
      // ================================
      // BULANAN
      // ================================

      const bulanTerpilih = document.getElementById("printBulan").value;

      if (!bulanTerpilih) {
        throw new Error("Pilih bulan dan tahun terlebih dahulu!");
      }

      dataRombel = dataRombel.filter((row) => {
        const tgl = toLocalDateStr(row.created_at);
        return tgl.startsWith(bulanTerpilih);
      });
    }

    if (dataRombel.length === 0) {
      const rombelTersedia = [
        ...new Set(
          semuaData
            .filter((row) => row.rombel)
            .map((row) => String(row.rombel).trim()),
        ),
      ];

      const hint = rombelTersedia.length
        ? ` Rombel yang tersedia di database: ${rombelTersedia.slice(0, 10).join(", ")}${rombelTersedia.length > 10 ? ", ..." : ""}.`
        : "";

      throw new Error(
        "Tidak ada data riwayat absensi ditemukan untuk rombel dan periode tersebut!" +
          hint,
      );
    }

    // ================================
    // DAFTAR TANGGAL
    // ================================

    const daftarTanggal = [
      ...new Set(dataRombel.map((row) => toLocalDateStr(row.created_at))),
    ].sort();

    // ================================
    // DAFTAR SISWA
    // ================================

    const daftarSiswa = {};

    dataRombel.forEach((row) => {
      const rfid = row.idcard;

      const nama = row.users
        ? Array.isArray(row.users)
          ? row.users[0]?.username
          : row.users.username
        : "Tidak Dikenal";

      if (!daftarSiswa[rfid]) {
        daftarSiswa[rfid] = {
          Nama: nama,
          RFID: rfid,
          Rombel: row.rombel,
          Kelas: row.kelas || "-",
          Rayon: formatRayonPrint(row.rayon),
          LogTanggal: {},
        };
      }

      daftarSiswa[rfid].LogTanggal[toLocalDateStr(row.created_at)] =
        row.status || "Hadir";
    });

    return {
      daftarTanggal,
      daftarSiswa,
      rombelLabel,
      kelasLabel,
      jenisLaporan,
    };
  }

  // ==================================================
  // BUAT DATA TABEL
  // ==================================================

  function buatDataTabel(daftarTanggal, daftarSiswa) {
    const jumlahTanggal = daftarTanggal.length;

    const fontTanggal = jumlahTanggal > 24 ? 7 : jumlahTanggal > 16 ? 8 : 10;

    const padTanggal = jumlahTanggal > 24 ? "1px 1px" : "4px 2px";

    // ==========================================
    // HEADER TANGGAL
    // ==========================================

    let headerTanggalHtml = "";

    daftarTanggal.forEach((tgl) => {
      const s = tgl.split("-");

      headerTanggalHtml += `
      <th style="
        text-align: center;
        font-size: ${fontTanggal}px;
        white-space: nowrap;
        border: 1px solid #ccc;
        padding: ${padTanggal};
        width: 24px;
        min-width: 24px;
        max-width: 24px;
        vertical-align: middle;
      ">
        ${s[2]}/${s[1]}
      </th>
    `;
    });

    // ==========================================
    // BARIS SISWA
    // ==========================================

    let barisSiswaHtml = "";

    let nomor = 1;

    for (const rfid in daftarSiswa) {
      const siswa = daftarSiswa[rfid];

      let kolomStatusHtml = "";

      let totalHadir = 0;

      // ========================================
      // STATUS SETIAP TANGGAL
      // ========================================

      daftarTanggal.forEach((tgl) => {
        const status = siswa.LogTanggal[tgl] || "Alfa";

        const huruf =
          status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();

        let color = "#dc2626";

        if (huruf === "H") {
          color = "#16a34a";

          totalHadir++;
        } else if (huruf === "I" || huruf === "S") {
          color = "#ea580c";
        }

        kolomStatusHtml += `
        <td style="
          text-align: center;
          font-weight: bold;
          color: ${color};
          border: 1px solid #ccc;
          padding: ${padTanggal};
          width: 24px;
          min-width: 24px;
          max-width: 24px;
          vertical-align: middle;
        ">
          ${huruf}
        </td>
      `;
      });

      // ========================================
      // BARIS SISWA
      // ========================================

      barisSiswaHtml += `
      <tr style="
        background: var(--color-card-bg);
        color: var(--color-teks);
      ">

        <td style="
          text-align: center;
          border: 1px solid #ccc;
          padding: 5px;
        ">
          ${nomor++}
        </td>


        <td style="
          border: 1px solid #ccc;
          padding: 5px 8px;
          text-align: center;
        ">
          ${siswa.Nama}
        </td>

        <td style="
          border: 1px solid #ccc;
          padding: 5px 8px;
          text-align: center;
        ">
          ${siswa.Kelas}
        </td>

        <td style="
          text-align: center;
          border: 1px solid #ccc;
          padding: 5px;
        ">
          ${siswa.Rombel}
        </td>

        <td style="
          border: 1px solid #ccc;
          padding: 5px 8px;
          text-align: center;
        ">
          ${siswa.Rayon}
        </td>


        ${kolomStatusHtml}


        <td style="
          text-align: center;
          font-weight: bold;
          border: 1px solid #ccc;
          padding: 5px;
        ">
          ${totalHadir} Hari
        </td>

      </tr>
    `;
    }

    // ==========================================
    // RETURN
    // ==========================================

    return {
      headerTanggalHtml,
      barisSiswaHtml,
    };
  }

  // ==================================================
  // BUAT PREVIEW
  // ==================================================

  async function tampilkanPreview(format) {
    btnPreviewCetak.disabled = true;

    btnPreviewCetak.innerHTML = `
      <span
        class="spinner-border spinner-border-sm"
      ></span>
      Membuat Preview...
    `;

    try {
      const { daftarTanggal, daftarSiswa, rombelLabel, kelasLabel, jenisLaporan } =
        await prosesDataSiswa();

      const { headerTanggalHtml, barisSiswaHtml } = buatDataTabel(
        daftarTanggal,
        daftarSiswa,
      );

      previewRekap.style.display = "block";

      previewRekap.innerHTML = `
        <div
          class="data-card p-4"
          style="
            background: var(--color-card-bg);
            color: var(--color-teks);
            border-radius:12px;
            box-shadow:0 4px 15px rgba(0,0,0,.08);
          "
        >

          <div
            style="
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin-bottom:20px;
              gap:15px;
            "
          >

            <div>
              <h4 style="margin:0;font-weight:700;">
                Preview Rekapitulasi
              </h4>

              <small style="color: var(--color-teks-sub);">
                ${rombelLabel}${kelasLabel ? ` • ${kelasLabel}` : ""}
                •
                ${jenisLaporan.toUpperCase()}
                •
                ${format.toUpperCase()}
              </small>
            </div>

            <span
              style="
                padding:6px 12px;
                border-radius:20px;
                background:#eef2ff;
                color:#4f46e5;
                font-size:12px;
                font-weight:600;
              "
            >
              ${format === "pdf" ? "PDF" : "EXCEL"}
            </span>

          </div>


          <div
            style="
              overflow-x:auto;
              max-height:100%;
              overflow-y:auto;
              border:1px solid var(--border-sidebar);
              border-radius:8px;
            "
          >

            <table
              style="
                width:100%;
                border-collapse:collapse;
                min-width:900px;
                font-size:12px;
              "
              border="1"
              cellspacing="0"
              cellpadding="7"
            >

              <thead>

                <tr
                  style="
                    background: var(--bg-tab);
                  "
                >

                  <th style="width:4%; text-align:center;">
                    No
                  </th>

                  <th
                    style="
                      width:25%;
                      text-align:center;
                    ">
                    Nama Siswa
                  </th>

                  <th style="width:10%; text-align:center;">
                    Kelas
                  </th>

                  <th style="width:10%; text-align:center;">
                    Rombel
                  </th>

                  <th style="width:10%; text-align:center;">
                    Rayon
                  </th>

                  ${headerTanggalHtml}

                  <th style="width:10%; text-align:center;">
                    Total Hadir
                  </th>

                </tr>

              </thead>

              <tbody>
                ${barisSiswaHtml}
              </tbody>

            </table>

          </div>


          <div
            style="
              margin-top:15px;
              font-size:11px;
              color: var(--color-teks-sub);
            "
          >
            <b>Keterangan:</b>

            <span style="color:#198754;">
              H = Hadir
            </span>

            &nbsp; | &nbsp;

            <span style="color:#dc3545;">
              A = Alfa
            </span>

            &nbsp; | &nbsp;

            <span style="color:#fd7e14;">
              I = Izin
            </span>

            &nbsp; | &nbsp;

            <span style="color:#fd7e14;">
              S = Sakit
            </span>
          </div>


          <div
            style="
              display:flex;
              justify-content:flex-end;
              gap:10px;
              margin-top:20px;
            "
          >

            <button
              id="btnBatalPreview"
              class="btn btn-light"
            >
              <i class="bi bi-x-lg"></i>
              Batal
            </button>

            <button
              id="btnDownloadPreview"
              class="btn btn-primary"
            >
              <i class="bi bi-download"></i>
              Unduh ${format === "pdf" ? "PDF" : "Excel"}
            </button>

          </div>

        </div>
      `;

      // ================================
      // BATAL PREVIEW
      // ================================

      document
        .getElementById("btnBatalPreview")
        .addEventListener("click", () => {
          previewRekap.innerHTML = "";

          previewRekap.style.display = "none";

          printFormat.value = "";
        });

      // ================================
      // DOWNLOAD
      // ================================

      const btnDownload = document.getElementById("btnDownloadPreview");
      btnDownload.addEventListener("click", async () => {
        btnDownload.disabled = true;
        btnDownload.innerHTML = `
          <span class="spinner-border spinner-border-sm"></span>
          Menyiapkan ${format === "excel" ? "Excel" : "PDF"}...
        `;

        try {
          if (format === "excel") {
            await downloadExcel(
              daftarTanggal,
              daftarSiswa,
              rombelLabel,
              jenisLaporan,
              kelasLabel,
            );
          } else {
            await downloadPDF(
              daftarTanggal,
              daftarSiswa,
              rombelLabel,
              jenisLaporan,
              kelasLabel,
            );
          }
        } catch (err) {
          console.error("Gagal mengunduh berkas:", err);
          alert("Gagal mengunduh: " + (err.message || err));
        } finally {
          btnDownload.disabled = false;
          btnDownload.innerHTML = `
            <i class="bi bi-download"></i>
            Unduh ${format === "pdf" ? "PDF" : "Excel"}
          `;
        }
      });
    } catch (error) {
      previewRekap.innerHTML = `
        <div class="alert alert-danger">
          <i class="bi bi-exclamation-triangle-fill"></i>
          ${error.message}
        </div>
      `;

      previewRekap.style.display = "block";
    } finally {
      btnPreviewCetak.disabled = false;

      btnPreviewCetak.innerHTML = `
        <i class="bi bi-eye"></i>
        Tampilkan Preview
      `;
    }
  }

  // ==================================================
  // DOWNLOAD EXCEL
  // ==================================================

  async function downloadExcel(
    daftarTanggal,
    daftarSiswa,
    rombelTerpilih,
    jenisLaporan,
  ) {
    const rowsExcel = [];

    let nomor = 1;

    for (const rfid in daftarSiswa) {
      const siswa = daftarSiswa[rfid];

      const rowData = {
        No: nomor++,
        "Nama Siswa": siswa.Nama,
        RFID: siswa.RFID,
        Kelas: siswa.Kelas,
        Rombel: siswa.Rombel,
        Rayon: siswa.Rayon,
      };

      let totalHadir = 0;

      daftarTanggal.forEach((tgl) => {
        const status = siswa.LogTanggal[tgl] || "Alfa";

        rowData[tgl] =
          status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();

        if (status === "Hadir") {
          totalHadir++;
        }
      });

      rowData["Total Hadir"] = `${totalHadir} Hari`;

      rowsExcel.push(rowData);
    }

    const workSheet = XLSX.utils.json_to_sheet(rowsExcel);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, workSheet, "Rekap Absensi");

    XLSX.writeFile(
      workbook,
      `Rekap_${jenisLaporan.toUpperCase()}_${String(rombelTerpilih).replace(/\s+/g, "-")}.xlsx`,
    );
  }

  // ==================================================
  // DOWNLOAD PDF
  // ==================================================

  async function downloadPDF(
    daftarTanggal,
    daftarSiswa,
    rombelTerpilih,
    jenisLaporan,
    kelasLabel,
  ) {
    const { headerTanggalHtml, barisSiswaHtml } = buatDataTabel(
      daftarTanggal,
      daftarSiswa,
    );

    const opsiNamaFile = `Rekap_${jenisLaporan.toUpperCase()}_${String(rombelTerpilih).replace(/\s+/g, "-")}_${new Date()
      .toISOString()
      .substring(0, 10)}.pdf`;

    // ==========================================
    // CONTAINER PDF
    // ==========================================

    const elementPdf = document.createElement("div");

    elementPdf.id = "pdf-export-container";

    elementPdf.style.position = "absolute";
    elementPdf.style.left = "0";
    elementPdf.style.top = "0";

    // A4 Landscape dalam pixel
    elementPdf.style.width = "1123px";
    elementPdf.style.minHeight = "794px";

    elementPdf.style.margin = "0";
    elementPdf.style.padding = "35px 45px";

    elementPdf.style.backgroundColor = "#ffffff";
    elementPdf.style.color = "#111827";

    elementPdf.style.boxSizing = "border-box";

    // PENTING
    elementPdf.style.display = "block";
    elementPdf.style.overflow = "visible";

    elementPdf.style.zIndex = "9999";
    elementPdf.style.pointerEvents = "none";

    // ==========================================
    // ISI PDF
    // ==========================================

    elementPdf.innerHTML = `

    <div style="
      font-family: Arial, sans-serif;
      width: 100%;
      background: #ffffff;
      color: #111827;
      box-sizing: border-box;
    ">

      <!-- HEADER -->

      <div style="
        text-align: center;
        margin-bottom: 20px;
      ">

        <h2 style="
          margin: 0;
          padding: 0;
          font-size: 18px;
          line-height: 1.3;
          font-weight: bold;
          color: #111827;
          text-transform: uppercase;
        ">
          REKAPITULASI ABSENSI SISWA
        </h2>

        <h3 style="
          margin: 6px 0;
          padding: 0;
          font-size: 13px;
          line-height: 1.3;
          font-weight: 600;
          color: #374151;
        ">
          KOMPETENSI KEAHLIAN:
          ${rombelTerpilih}${kelasLabel ? ` - ${kelasLabel}` : ""}
        </h3>

        <p style="
          margin: 5px 0 0 0;
          padding: 0;
          font-size: 11px;
          line-height: 1.3;
          color: #6b7280;
        ">
          Periode Laporan:
          <b>${jenisLaporan.toUpperCase()}</b>
          |
          Tanggal Unduh:
          ${new Date().toLocaleDateString("id-ID")}
        </p>

      </div>


      <!-- TABLE -->

      <table style="
          width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  margin: 0;
  padding: 0;
  background: #ffffff;
  color: #111827;
  font-family: Arial, sans-serif;
  font-size: 10px;
  border: 1px solid #9ca3af;
      border="1"
      cellspacing="0"
      cellpadding="5">

        <thead>

          <tr style="
            background-color: #f3f4f6;
            color: #111827;
            font-weight: bold;
          ">

            <th style="
              width: 35px;
              border: 1px solid #9ca3af;
              padding: 6px 3px;
              text-align: center;
              vertical-align: middle;
            ">
              No
            </th>

            <th style="
              width: 180px;
              border: 1px solid #9ca3af;
              padding: 6px;
              text-align: center;
              vertical-align: middle;
            ">
              Nama Siswa
            </th>

            <th style="
              width: 70px;
              border: 1px solid #9ca3af;
              padding: 6px 3px;
              text-align: center;
              vertical-align: middle;
            ">
              Kelas
            </th>

            <th style="
              width: 70px;
              border: 1px solid #9ca3af;
              padding: 6px 3px;
              text-align: center;
              vertical-align: middle;
            ">
              Rombel
            </th>

            <th style="
              width: 70px;
              border: 1px solid #9ca3af;
              padding: 6px 3px;
              text-align: center;
              vertical-align: middle;
            ">
              Rayon
            </th>

            ${headerTanggalHtml}

            <th style="
              width: 80px;
              border: 1px solid #9ca3af;
              padding: 6px 3px;
              text-align: center;
              vertical-align: middle;
            ">
              Total Hadir
            </th>

          </tr>

        </thead>

        <tbody>

          ${barisSiswaHtml}

        </tbody>

      </table>


      <!-- KETERANGAN -->

      <div style="
        margin-top: 15px;
        font-family: Arial, sans-serif;
        font-size: 10px;
        line-height: 1.5;
        color: #4b5563;
      ">

        <b>Keterangan Huruf:</b>

        <span style="
          color:#16a34a;
          font-weight:bold;
          margin-left:6px;
        ">
          H
        </span>
        = Hadir,

        <span style="
          color:#dc2626;
          font-weight:bold;
          margin-left:6px;
        ">
          A
        </span>
        = Alfa,

        <span style="
          color:#ea580c;
          font-weight:bold;
          margin-left:6px;
        ">
          I
        </span>
        = Izin,

        <span style="
          color:#ea580c;
          font-weight:bold;
          margin-left:6px;
        ">
          S
        </span>
        = Sakit

      </div>

    </div>
  `;

    // ==========================================
    // MASUKKAN KE DOM
    // ==========================================

    document.body.appendChild(elementPdf);

    try {
      // Tunggu browser menyelesaikan layout
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      // ==========================================
      // UKUR UKURAN ELEMENT
      // ==========================================

      const lebarCanvas = elementPdf.offsetWidth;
      const tinggiCanvas = elementPdf.scrollHeight;

      console.log("PDF WIDTH :", lebarCanvas);
      console.log("PDF HEIGHT:", tinggiCanvas);

      // ==========================================
      // KONFIGURASI PDF
      // ==========================================

      const opsiPdf = {
        margin: 0,

        filename: opsiNamaFile,

        image: {
          type: "jpeg",
          quality: 0.98,
        },

        html2canvas: {
          scale: 2,

          useCORS: true,

          backgroundColor: "#ffffff",

          logging: false,

          width: lebarCanvas,

          height: tinggiCanvas,

          scrollX: 0,

          scrollY: 0,
        },

        jsPDF: {
          unit: "mm",

          format: "a4",

          orientation: "landscape",
        },

        pagebreak: {
          mode: ["css", "legacy"],
        },
      };

      // ==========================================
      // GENERATE PDF
      // ==========================================

      await html2pdf().set(opsiPdf).from(elementPdf).save();
    } catch (err) {
      console.error("Gagal generate PDF:", err);

      throw err;
    } finally {
      // Baru hapus setelah selesai
      elementPdf.remove();
    }
  }

  // ==================================================
  // TOMBOL PREVIEW
  // ==================================================

  btnPreviewCetak.addEventListener("click", async () => {
    const format = printFormat.value;

    if (!format) {
      alert("Silakan pilih format laporan terlebih dahulu!");

      printFormat.focus();

      return;
    }

    await tampilkanPreview(format);
  });
}

// function initPrint() {
//   const radioMingguan = document.getElementById("rekapMingguan");
//   const radioBulanan = document.getElementById("rekapBulanan");
//   const boxPilihanBulan = document.getElementById("boxPilihanBulan");
//   const btnCetakExcel = document.getElementById("btnProsesCetakExcel");
//   const btnCetakPdf = document.getElementById("btnProsesCetakPdf");
//   const printKelas = document.getElementById("printKelas");
//   const printRombel = document.getElementById("printRombel");

//   if (!btnCetakExcel || !btnCetakPdf) return;

//   radioMingguan.addEventListener("change", () => {
//     boxPilihanBulan.style.display = "none";
//   });
//   radioBulanan.addEventListener("change", () => {
//     boxPilihanBulan.style.display = "block";
//   });

//   printKelas.addEventListener("change", function () {
//     const kelas = this.value;
//     const options = [];
//     for (let i = 1; i <= 5; i++) {
//       options.push(`<option value="${kelas}_${i}">PPLG ${kelas}-${i}</option>`);
//     }
//     printRombel.innerHTML = options.join("");
//   });

//   async function prosesDataSiswa() {
//     const rombelTerpilih = printRombel.value.replace("_", "-").toUpperCase();
//     const jenisLaporan = document.querySelector(
//       'input[name="jenisRekap"]:checked',
//     ).value;

//     const semuaData = await fetchAttendanceData();

//     let dataRombel = semuaData.filter((row) => {
//       const r = String(row.rombel || "").toUpperCase();
//       const rombelDbBersih = r.replace(/[-_]/g, "");
//       const rombelTargetBersih = rombelTerpilih.replace(/[-_]/g, "");
//       return rombelDbBersih.includes(rombelTargetBersih);
//     });

//     const hariIni = new Date();
//     if (jenisLaporan === "mingguan") {
//       const jarakKeSenin = hariIni.getDay() === 0 ? 6 : hariIni.getDay() - 1;
//       const senin = new Date(hariIni);
//       senin.setDate(hariIni.getDate() - jarakKeSenin);

//       const jumat = new Date(senin);
//       jumat.setDate(senin.getDate() + 4);

//       const startStr = senin.toLocaleDateString("sv-SE");
//       const endStr = jumat.toLocaleDateString("sv-SE");

//       dataRombel = dataRombel.filter((row) => {
//         if (!row.created_at) return false;
//         const tgl = row.created_at.split("T")[0];
//         return tgl >= startStr && tgl <= endStr;
//       });
//     } else {
//       const bulanTerpilih = document.getElementById("printBulan").value;
//       dataRombel = dataRombel.filter(
//         (row) => row.created_at && row.created_at.startsWith(bulanTerpilih),
//       );
//     }

//     if (dataRombel.length === 0) {
//       throw new Error(
//         "Tidak ada data riwayat absensi ditemukan untuk rombel dan periode tersebut!",
//       );
//     }

//     const daftarTanggal = [
//       ...new Set(dataRombel.map((row) => row.created_at.split("T")[0])),
//     ].sort();
//     const daftarSiswa = {};

//     dataRombel.forEach((row) => {
//       const rfid = row.idcard;
//       const nama = row.users
//         ? Array.isArray(row.users)
//           ? row.users[0]?.username
//           : row.users.username
//         : "Tidak Dikenal";

//       if (!daftarSiswa[rfid]) {
//         daftarSiswa[rfid] = {
//           Nama: nama,
//           RFID: rfid,
//           Rombel: row.rombel,
//           LogTanggal: {},
//         };
//       }
//       daftarSiswa[rfid].LogTanggal[row.created_at.split("T")[0]] =
//         row.status || "Hadir";
//     });

//     return { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan };
//   }

//   btnCetakExcel.addEventListener("click", async () => {
//     btnCetakExcel.disabled = true;
//     btnCetakExcel.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Memproses Data...`;

//     try {
//       const { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan } =
//         await prosesDataSiswa();
//       const rowsExcel = [];
//       let nomor = 1;

//       for (const rfid in daftarSiswa) {
//         const siswa = daftarSiswa[rfid];
//         const rowData = {
//           No: nomor++,
//           "Nama Siswa": siswa.Nama,
//           RFID: siswa.RFID,
//           Rombel: siswa.Rombel,
//         };
//         let totalHadir = 0;

//         daftarTanggal.forEach((tgl) => {
//           const status = siswa.LogTanggal[tgl] || "Alfa";
//           rowData[tgl] =
//             status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();
//           if (status === "Hadir") totalHadir++;
//         });

//         rowData["Total Hadir"] = `${totalHadir} Hari`;
//         rowsExcel.push(rowData);
//       }

//       const workSheet = XLSX.utils.json_to_sheet(rowsExcel);
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, workSheet, "Rekap Absensi");
//       XLSX.writeFile(
//         workbook,
//         `Rekap_${jenisLaporan.toUpperCase()}_PPLG_${rombelTerpilih}.xlsx`,
//       );
//     } catch (error) {
//       alert(error.message || "Terjadi Kesalahan");
//     } finally {
//       btnCetakExcel.disabled = false;
//       btnCetakExcel.innerHTML = `<i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh Excel`;
//     }
//   });

//   btnCetakPdf.addEventListener("click", async () => {
//     btnCetakPdf.disabled = true;
//     btnCetakPdf.innerHTML = `<span class="spinner-border spinner-border-sm"></span>...`;
//     try {
//       const { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan } =
//         await prosesDataSiswa();

//       let headerTanggalHtml = "";
//       daftarTanggal.forEach((tgl) => {
//         const s = tgl.split("-");
//         headerTanggalHtml += `<th style="text-align:center; font-size:11px;">${s[2]}/${s[1]}</th>`;
//       });

//       let barisSiswaHtml = "";
//       let nomor = 1;
//       for (const rfid in daftarSiswa) {
//         const siswa = daftarSiswa[rfid];
//         let kolomStatusHtml = "";
//         let totalHadir = 0;

//         daftarTanggal.forEach((tgl) => {
//           const status = siswa.LogTanggal[tgl] || "Alfa";
//           const huruf =
//             status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();
//           let color = "red";
//           if (huruf === "H") {
//             color = "green";
//             totalHadir++;
//           } else if (huruf === "I" || huruf === "S") color = "orange";

//           kolomStatusHtml += `<td style="text-align:center; font-weight:bold; color:${color};">${huruf}</td>`;
//         });

//         barisSiswaHtml += `
//           <tr>
//               <td style="text-align:center;">${nomor++}</td>
//               <td>${siswa.Nama}</td>
//               <td style="text-align:center;">${siswa.Rombel}</td>
//               ${kolomStatusHtml}
//               <td style="text-align:center; font-weight:bold;">${totalHadir} Hari</td>
//           </tr>
//         `;
//       }

//       const elementPdf = document.createElement("div");
//       elementPdf.style.padding = "20px";
//       elementPdf.style.background = "white";
//       elementPdf.innerHTML = `
//         <div style="font-family: Arial, sans-serif; color: #333;">
//             <div style="text-align: center; margin-bottom: 20px;">
//                 <h2 style="margin: 0; padding-bottom: 5px; text-transform: uppercase; font-size: 18px;">REKAPITULASI ABSENSI SISWA</h2>
//                 <h3 style="margin:5px 0; font-size: 14px;">KOMPETENSI KEAHLIAN: PPLG (Rombel ${rombelTerpilih})</h3>
//                 <p style="margin: 5px 0; color: #666; font-size: 11px;">Periode Laporan: Laporan ${jenisLaporan.toUpperCase()} | Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}</p>
//             </div>
//             <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" border="1" cellspacing="0" cellpadding="5">
//                 <thead>
//                     <tr style="background-color: #f2f2f2;">
//                         <th style="width: 4%; font-size: 11px;">No</th>
//                         <th style="width: 25%; text-align:left; padding-left:10px; font-size:11px;">Nama Siswa</th>
//                         <th style="width: 10%; font-size: 11px;">Rombel</th>
//                         ${headerTanggalHtml}
//                         <th style="width: 12%; font-size: 11px;">Total Hadir</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     ${barisSiswaHtml}
//                 </tbody>
//             </table>
//             <div style="margin-top: 15px; font-size: 10px; color: #555;">
//                 * Keterangan Huruf: <span style="color:green; font-weight:bold;">H</span> = Hadir, <span style="color:red; font-weight:bold;">A</span> = Alfa, <span style="color:orange; font-weight:bold;">I</span> = Izin, <span style="color:orange; font-weight:bold;">S</span> = Sakit
//             </div>
//         </div>
//       `;

//       const opsiNamaFile = `Rekap_${jenisLaporan.toUpperCase()}_PPLG_${rombelTerpilih}_${new Date().toISOString().substring(0, 10)}.pdf`;
//       const opsiPdf = {
//         margin: 10,
//         fileName: opsiNamaFile,
//         Image: { type: "jpeg", quality: 0.98 },
//         html2canvas: { scale: 2, useCORS: true },
//         jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
//       };

//       await html2pdf().set(opsiPdf).from(elementPdf).save();
//     } catch (error) {
//       alert(error.message || "Terjadi Kesalahan saat mengunduh PDF");
//     } finally {
//       btnCetakPdf.disabled = false;
//       btnCetakPdf.innerHTML = `<i class="bi bi-file-earmark-pdf-fill"></i> Generate & Unduh PDF`;
//     }
//   });
// }
