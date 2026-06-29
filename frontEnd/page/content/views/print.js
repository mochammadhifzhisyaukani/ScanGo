function renderPrint() {
  const currentMonth = new Date().toISOString().substring(0, 7);
  return `
        <div class="print-container animate__animated animate__fadeIn mt-4" style="padding: 20px;">
        <div class="data-card p-4" style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <div class="text-center mb-4">
                <i class="bi bi-printer-fill text-primary" style="font-size: 2.5rem;"></i>
                <h4 class="fw-bold mt-2" style="color: var(--color-teks);">Cetak Rekapitulasi Absensi</h4>
                <p class="text-muted" style="font-size: 0.9rem;">Unduh laporan absensi siswa dalam format Excel (.xlsx)</p>
            </div>
            
            <hr class="text-muted mb-4">

            <div class="mb-3">
                <label class="form-label fw-semibold text-muted" style="font-size: 0.85rem;">Pilih Kelas</label>
                <select id="printKelas" class="form-select bg-light border-0 rounded-3" style="height: 40px; font-size: 0.9rem;">
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold text-muted" style="font-size: 0.85rem;">Pilih Rombel</label>
                <select id="printRombel" class="form-select bg-light border-0 rounded-3" style="height: 40px; font-size: 0.9rem;">
                    <option value="X_1">PPLG X-1</option>
                    <option value="X_2">PPLG X-2</option>
                    <option value="X_3">PPLG X-3</option>
                    <option value="X_4">PPLG X-4</option>
                    <option value="X_5">PPLG X-5</option>
                </select>
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold text-muted" style="font-size: 0.85rem;">Jenis Rekapitulasi</label>
                <div class="d-flex gap-4 mt-1">
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="jenisRekap" id="rekapMingguan" value="mingguan" checked>
                        <label class="form-check-label" for="rekapMingguan">Minggu Ini</label>
                    </div>
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="jenisRekap" id="rekapBulanan" value="bulanan">
                        <label class="form-check-label" for="rekapBulanan">Bulan Ini</label>
                    </div>
                </div>
            </div>

            <div class="mb-4" id="boxPilihanBulan" style="display: none;">
                <label class="form-label fw-semibold text-muted" style="font-size: 0.85rem;">Pilih Bulan & Tahun</label>
                <input type="month" id="printBulan" class="form-control bg-light border-0 rounded-3" style="height: 40px;" value="${currentMonth}">
            </div>

            <button id="btnProsesCetak" class="btn btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2" style="height: 42px; font-weight: 500;">
                <i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh Excel
            </button>
        </div>
    </div>
    `;
}

function initPrint() {
  const radioMingguan = document.getElementById("rekapMingguan");
  const radioBulanan = document.getElementById("rekapBulanan");
  const boxPilihanBulan = document.getElementById("boxPilihanBulan");
  const btnCetak = document.getElementById("btnProsesCetak");
  const printKelas = document.getElementById("printKelas");
  const printRombel = document.getElementById("printRombel");

  if (!btnCetak) return;

  radioMingguan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "none";
  });
  radioBulanan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "block";
  });

  printKelas.addEventListener("change", function () {
    const kelas = this.value;
    printRombel.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      printRombel.innerHTML += `<option value="${kelas}_${i}">PPLG ${kelas}-${i}</option>`;
    }
  });

  btnCetak.addEventListener("click", async () => {
    btnCetak.disabled = true;
    btnCetak.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Memproses Data...`;

    try {
      const rombelTerpilih = printRombel.value.replace("_", "-").toUpperCase();
      const jenisLaporan = document.querySelector(
        'input[name="jenisRekap"]:checked',
      ).value;

      const semuaData = await fetchAttendanceData();

      let dataRombel = semuaData.filter((row) => {
        const r = String(row.rombel || "").toUpperCase();
        const rombelDbBersih = r.replace(/[-_]/g, "");
        const rombelTargetBersih = rombelTerpilih.replace(/[-_]/g, "");

        return rombelDbBersih.includes(rombelTargetBersih);
      });

      const hariIni = new Date();
      if (jenisLaporan === "mingguan") {
        const day = hariIni.getDay();
        const jarakKeSenin = day === 0 ? 6 : day - 1;

        const senin = new Date(hariIni);
        senin.setDate(hariIni.getDate() - jarakKeSenin);

        const jumat = new Date(senin);
        jumat.setDate(senin.getDate() + 4);

        const startStr = senin.toLocaleDateString("sv-SE");
        const endStr = jumat.toLocaleDateString("sv-SE");

        dataRombel = dataRombel.filter((row) => {
          if (!row.created_at) return false;
          const tgl = new Date(row.created_at).toLocaleDateString("sv-SE");
          return tgl >= startStr && tgl <= endStr; 
        });
      } else {
        const bulanTerpilih = document.getElementById("printBulan").value;
        dataRombel = dataRombel.filter(
          (row) => row.created_at && new Date(row.created_at).toLocaleDateString("sv-SE").startsWith(bulanTerpilih),
        );
      }

      if (dataRombel.length === 0) {
        alert(
          "Tidak ada data riwayat absensi ditemukan untuk rombel dan periode tersebut!",
        );
        return;
      }

      const daftarTanggal = [
        ...new Set(dataRombel.map((row) => row.created_at.split("T")[0])),
      ].sort();

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
            LogTanggal: {},
          };
        }

        daftarSiswa[rfid].LogTanggal[row.created_at.split("T")[0]] =
          row.status || "Hadir";
      });

      const rowsExcel = [];
      let nomor = 1;

      for (const rfid in daftarSiswa) {
        const siswa = daftarSiswa[rfid];
        const rowData = {
          No: nomor++,
          "Nama Siswa": siswa.Nama,
          RFID: siswa.RFID,
          Rombel: siswa.Rombel,
        };

        let totalHadir = 0;

        daftarTanggal.forEach((tgl) => {
          const status = siswa.LogTanggal[tgl] || "Alfa";
          rowData[tgl] =
            status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();

          if (status === "Hadir") totalHadir++;
        });

        rowData["Total Hadir"] = `${totalHadir} Hari`;
        rowsExcel.push(rowData);
      }

      if (typeof XLSX === "undefined") {
        alert(
          "Pustaka SheetJS (XLSX) belum dimuat! Pastikan script CDN XLSX sudah terpasang di index.html",
        );
        return;
      }

      const workSheet = XLSX.utils.json_to_sheet(rowsExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, workSheet, "Rekap Absensi");

      const namaFile = `Rekap_${jenisLaporan.toUpperCase()}_PPLG_${rombelTerpilih}_${new Date().toLocaleDateString("sv-SE")}.xlsx`;
      XLSX.writeFile(workbook, namaFile);
    } catch (error) {
      console.error(error);
      alert("Terjadi kegagalan saat menyusun data laporan");
    } finally {
      btnCetak.disabled = false;
      btnCetak.innerHTML = `<i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh Excel`;
    }
  });
};    
