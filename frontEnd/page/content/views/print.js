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

            <button id="btnProsesCetakExcel" class="btn btn-primary w-100 rounded-3 d-flex align-items-center justify-content-center gap-2" style="height: 42px; font-weight: 500;">
                <i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh Excel
            </button>
            <button id="btnProsesCetakPdf" class="btn btn-danger w-100 rounded-3 mt-2 d-flex align-items-center justify-content-center gap-2" style="height: 42px; font-weight: 500;">
                <i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh PDF
            </button>
        </div>
    </div>
    `;
}

function initPrint() {
  const radioMingguan = document.getElementById("rekapMingguan");
  const radioBulanan = document.getElementById("rekapBulanan");
  const boxPilihanBulan = document.getElementById("boxPilihanBulan");
  const btnCetakExcel = document.getElementById("btnProsesCetakExcel");
  const btnCetakPdf = document.getElementById("btnProsesCetakPdf");
  const printKelas = document.getElementById("printKelas");
  const printRombel = document.getElementById("printRombel");

  if (!btnCetakExcel || !btnCetakPdf) return;

  radioMingguan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "none";
  });
  radioBulanan.addEventListener("change", () => {
    boxPilihanBulan.style.display = "block";
  });

  printKelas.addEventListener("change", function () {
    const kelas = this.value;
    const options = [];
    for (let i = 1; i <= 5; i++) {
      options.push(`<option value="${kelas}_${i}">PPLG ${kelas}-${i}</option>`);
    }
    printRombel.innerHTML = options.join("");
  });

  async function prosesDataSiswa() {
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
      const jarakKeSenin = hariIni.getDay() === 0 ? 6 : hariIni.getDay() - 1;
      const senin = new Date(hariIni);
      senin.setDate(hariIni.getDate() - jarakKeSenin);

      const jumat = new Date(senin);
      jumat.setDate(senin.getDate() + 4);

      const startStr = senin.toLocaleDateString("sv-SE");
      const endStr = jumat.toLocaleDateString("sv-SE");

      dataRombel = dataRombel.filter((row) => {
        if (!row.created_at) return false;
        const tgl = row.created_at.split("T")[0];
        return tgl >= startStr && tgl <= endStr;
      });
    } else {
      const bulanTerpilih = document.getElementById("printBulan").value;
      dataRombel = dataRombel.filter(
        (row) => row.created_at && row.created_at.startsWith(bulanTerpilih),
      );
    }

    if (dataRombel.length === 0) {
      throw new Error(
        "Tidak ada data riwayat absensi ditemukan untuk rombel dan periode tersebut!",
      );
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

    return { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan };
  }

  btnCetakExcel.addEventListener("click", async () => {
    btnCetakExcel.disabled = true;
    btnCetakExcel.innerHTML = `<span class="spinner-border spinner-border-sm" role="status"></span> Memproses Data...`;

    try {
      const { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan } =
        await prosesDataSiswa();
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

      const workSheet = XLSX.utils.json_to_sheet(rowsExcel);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, workSheet, "Rekap Absensi");
      XLSX.writeFile(
        workbook,
        `Rekap_${jenisLaporan.toUpperCase()}_PPLG_${rombelTerpilih}.xlsx`,
      );
    } catch (error) {
      alert(error.message || "Terjadi Kesalahan");
    } finally {
      btnCetakExcel.disabled = false;
      btnCetakExcel.innerHTML = `<i class="bi bi-file-earmark-excel-fill"></i> Generate & Unduh Excel`;
    }
  });

  btnCetakPdf.addEventListener("click", async () => {
    btnCetakPdf.disabled = true;
    btnCetakPdf.innerHTML = `<span class="spinner-border spinner-border-sm"></span>...`;
    try {
      const { daftarTanggal, daftarSiswa, rombelTerpilih, jenisLaporan } =
        await prosesDataSiswa();

      let headerTanggalHtml = "";
      daftarTanggal.forEach((tgl) => {
        const s = tgl.split("-");
        headerTanggalHtml += `<th style="text-align:center; font-size:11px;">${s[2]}/${s[1]}</th>`;
      });

      let barisSiswaHtml = "";
      let nomor = 1;
      for (const rfid in daftarSiswa) {
        const siswa = daftarSiswa[rfid];
        let kolomStatusHtml = "";
        let totalHadir = 0;

        daftarTanggal.forEach((tgl) => {
          const status = siswa.LogTanggal[tgl] || "Alfa";
          const huruf =
            status === "Hadir" ? "H" : status.substring(0, 1).toUpperCase();
          let color = "red";
          if (huruf === "H") {
            color = "green";
            totalHadir++;
          } else if (huruf === "I" || huruf === "S") color = "orange";

          kolomStatusHtml += `<td style="text-align:center; font-weight:bold; color:${color};">${huruf}</td>`;
        });

        barisSiswaHtml += `
          <tr>
              <td style="text-align:center;">${nomor++}</td>
              <td>${siswa.Nama}</td>
              <td style="text-align:center;">${siswa.Rombel}</td>
              ${kolomStatusHtml}
              <td style="text-align:center; font-weight:bold;">${totalHadir} Hari</td>
          </tr>
        `;
      }

      const elementPdf = document.createElement("div");
      elementPdf.style.padding = "20px";
      elementPdf.style.background = "white";
      elementPdf.innerHTML = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; padding-bottom: 5px; text-transform: uppercase; font-size: 18px;">REKAPITULASI ABSENSI SISWA</h2>
                <h3 style="margin:5px 0; font-size: 14px;">KOMPETENSI KEAHLIAN: PPLG (Rombel ${rombelTerpilih})</h3>
                <p style="margin: 5px 0; color: #666; font-size: 11px;">Periode Laporan: Laporan ${jenisLaporan.toUpperCase()} | Tanggal Unduh: ${new Date().toLocaleDateString("id-ID")}</p>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" border="1" cellspacing="0" cellpadding="5">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="width: 4%; font-size: 11px;">No</th>
                        <th style="width: 25%; text-align:left; padding-left:10px; font-size:11px;">Nama Siswa</th>
                        <th style="width: 10%; font-size: 11px;">Rombel</th>
                        ${headerTanggalHtml}
                        <th style="width: 12%; font-size: 11px;">Total Hadir</th>
                    </tr>
                </thead>
                <tbody>
                    ${barisSiswaHtml}
                </tbody>
            </table>
            <div style="margin-top: 15px; font-size: 10px; color: #555;">
                * Keterangan Huruf: <span style="color:green; font-weight:bold;">H</span> = Hadir, <span style="color:red; font-weight:bold;">A</span> = Alfa, <span style="color:orange; font-weight:bold;">I</span> = Izin, <span style="color:orange; font-weight:bold;">S</span> = Sakit
            </div>
        </div>
      `;

      const opsiNamaFile = `Rekap_${jenisLaporan.toUpperCase()}_PPLG_${rombelTerpilih}_${new Date().toISOString().substring(0, 10)}.pdf`;
      const opsiPdf = {
        margin: 10,
        fileName: opsiNamaFile,
        Image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };

      await html2pdf().set(opsiPdf).from(elementPdf).save();
    } catch (error) {
      alert(error.message || "Terjadi Kesalahan saat mengunduh PDF");
    } finally {
      btnCetakPdf.disabled = false;
      btnCetakPdf.innerHTML = `<i class="bi bi-file-earmark-pdf-fill"></i> Generate & Unduh PDF`;
    }
  });
}
