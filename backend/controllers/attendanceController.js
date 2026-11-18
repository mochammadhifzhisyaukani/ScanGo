const supabase = require("../config/db");
const { rentangHariWIB, masukStatus, getWibMinutesNow } = require("../services/helper");

const storeAttendance = async (req, res) => {
  try {
    const idcard = req.query.idcard;
    const mac_address = req.query.mac_address;

    if (!idcard) {
      return res
        .status(400)
        .json({ success: false, message: "UID Kartu tidak terbaca" });
    }

    const { startWib, endWib } = rentangHariWIB();

    const [userRes, attRes] = await Promise.all([
      supabase
        .from("users")
        .select("username, idcard, whatsapp, rombel")
        .eq("idcard", idcard)
        .maybeSingle(),
      supabase
        .from("attendances")
        .select("id, time_finish")
        .eq("idcard", idcard)
        .gte("created_at", startWib)
        .lte("created_at", endWib)
        .maybeSingle(),
    ]);

    if (userRes.error) {
      console.error("Error store user lookup:", userRes.error.message);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan saat memverifikasi kartu." });
    }

    const uservalid = userRes.data;

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const namaPemilik = uservalid.username || "Siswa";

    if (attRes.error) {
      console.error("Error check existing:", attRes.error.message);
      throw attRes.error;
    }

    const existing = attRes.data;

    if (existing) {
      if (existing.time_finish) {
        return res.status(409).json({
          success: false,
          message: "Kartu ini sudah absen masuk & keluar hari ini.",
          already_finished: true,
          attendance_id: existing.id,
        });
      }

      return res.status(409).json({
        success: false,
        message: `Kartu ini sudah absen hari ini. Silahkan tap sekali lagi untuk absen keluar.`,
        already_checked_in: true,
        attendance_id: existing.id,
      });
    }

    const statusMasuk = masukStatus();
    if (!statusMasuk) {
      return res.status(403).json({
        success: false,
        message: "Di luar jam absensi masuk (04:30 - 10:00).",
      });
    }

    const { data: attendanceData, error: insertError } = await supabase
      .from("attendances")
      .insert([
        {
          idcard,
          mac_address: mac_address || "RFID Reader Card 135KHZ",
          status: statusMasuk,
        },
      ])
      .select();

    if (insertError) {
      console.error("Error insert attendance:", insertError.message);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menyimpan absensi." });
    }

    res.json({
      success: true,
      message: `Absensi berhasil dicatat! Selamat belajar ${namaPemilik}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error store attendance:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

const tapAttendance = async (req, res) => {
  try {
    const body = req.body || {};
    const query = req.query || {};
    const rawIdcard = String(body.idcard ?? query.idcard ?? "").trim();
    const rawUsername = String(body.username ?? query.username ?? "").trim();
    const mode =
      String(body.mode ?? query.mode ?? "masuk") === "keluar"
        ? "keluar"
        : "masuk";
    const macAddress = body.mac_address ?? query.mac_address ?? null;
    const statusInput =
      typeof body.status === "string" ? body.status.trim() : "";
    const noteInput = typeof body.note === "string" ? body.note.trim() : "";

    const byIdcard = rawIdcard !== "";
    if (!byIdcard && !rawUsername) {
      return res
        .status(400)
        .json({ success: false, code: "invalid_input", message: "UID kartu atau nama siswa wajib diisi." });
    }

    if (byIdcard && !/^\d+$/.test(rawIdcard)) {
      return res.status(403).json({
        success: false,
        code: "unknown_card",
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const { startWib, endWib } = rentangHariWIB();

    let uservalid;
    let existing;

    if (byIdcard) {
      const [userRes, attRes] = await Promise.all([
        supabase
          .from("users")
          .select("username, idcard, whatsapp, rombel")
          .eq("idcard", rawIdcard)
          .maybeSingle(),
        supabase
          .from("attendances")
          .select("id, time_finish")
          .eq("idcard", rawIdcard)
          .gte("created_at", startWib)
          .lte("created_at", endWib)
          .maybeSingle(),
      ]);

      if (userRes.error) {
        console.error("Error tap user lookup:", userRes.error.message);
        return res
          .status(500)
          .json({ success: false, message: "Terjadi kesalahan saat memverifikasi kartu." });
      }
      if (attRes.error) {
        console.error("Error tap attendance lookup:", attRes.error.message);
        throw attRes.error;
      }

      uservalid = userRes.data;
      existing = attRes.data;
    } else {
      const userRes = await supabase
        .from("users")
        .select("username, idcard, whatsapp, rombel")
        .ilike("username", rawUsername)
        .maybeSingle();

      if (userRes.error) {
        console.error("Error tap manual user lookup:", userRes.error.message);
        return res.status(500).json({ success: false, error: "Gagal mencari data siswa." });
      }
      if (!userRes.data) {
        return res.status(404).json({
          success: false,
          code: "user_not_found",
          error: `Nama "${rawUsername}" tidak ditemukan di database. Pastikan nama sesuai dengan data yang terdaftar.`,
        });
      }

      uservalid = userRes.data;

      const attRes = await supabase
        .from("attendances")
        .select("id, time_finish")
        .eq("idcard", String(uservalid.idcard))
        .gte("created_at", startWib)
        .lte("created_at", endWib)
        .maybeSingle();

      if (attRes.error) {
        console.error("Error tap manual attendance lookup:", attRes.error.message);
        throw attRes.error;
      }
      existing = attRes.data;
    }

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        code: "unknown_card",
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    // Aturan absensi: 1x masuk + 1x keluar per kartu per hari
    if (existing?.time_finish) {
      return res.status(409).json({
        success: false,
        code: "already_finished",
        message: "Kartu ini sudah absen masuk & keluar hari ini.",
        attendance_id: existing.id,
      });
    }

    if (mode === "masuk" && existing) {
      return res.status(409).json({
        success: false,
        code: "already_checked_in",
        message: "Kartu ini sudah absen hari ini.",
        attendance_id: existing.id,
      });
    }

    if (mode === "keluar" && !existing) {
      return res.status(409).json({
        success: false,
        code: "not_checked_in",
        message: "Kartu ini belum absen masuk hari ini.",
      });
    }

    if (!existing) {
      const macDefault = byIdcard ? "RFID Reader Card 135KHZ" : "Manual Input";
      let statusInsert = statusInput;
      if (!statusInsert) {
        const computed = masukStatus();
        if (!computed) {
          return res.status(403).json({
            success: false,
            code: "outside_window",
            message: "Di luar jam absensi masuk (04:30 - 10:00).",
          });
        }
        statusInsert = computed;
      }
      const insertPayload = {
        idcard: byIdcard ? rawIdcard : String(uservalid.idcard),
        mac_address: macAddress || macDefault,
        status: statusInsert,
      };
      if (!byIdcard) insertPayload.note = noteInput || "Tidak ada catatan";

      const { data: attendanceData, error: insertError } = await supabase
        .from("attendances")
        .insert([insertPayload])
        .select("id, created_at, status");

      if (insertError) {
        console.error("Error tap insert:", insertError.message);
        return res
          .status(500)
          .json({ success: false, message: byIdcard ? "Gagal menyimpan absensi." : "Gagal menyimpan absensi manual." });
      }

      const pesan = byIdcard
        ? `Absensi berhasil dicatat! Selamat belajar ${uservalid.username || "Siswa"}`
        : `Absensi manual berhasil! ${uservalid.username} tercatat dengan RFID ${uservalid.idcard}`;

      return res.json({
        success: true,
        action: "masuk",
        message: pesan,
        data: attendanceData,
      });
    }

    const nowIso = new Date().toISOString();
    const { error: updateError } = await supabase
      .from("attendances")
      .update({ time_finish: nowIso, updated_at: nowIso })
      .eq("id", existing.id);

    if (updateError) {
      console.error("Error tap update:", updateError.message);
      return res.status(500).json({ success: false, message: "Gagal memperbarui absensi keluar." });
    }

    return res.json({
      success: true,
      action: "keluar",
      message: `Absen keluar untuk ${uservalid.username} berhasil dicatat!`,
      attendance_id: existing.id,
    });
  } catch (error) {
    console.error("Error tap attendance:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

const manualAttendance = async (req, res) => {
  try {
    const { username, status, note } = req.body;

    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Nama siswa wajib diisi!" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username, idcard, whatsapp, rombel")
      .ilike("username", username.trim())
      .maybeSingle();

    if (userError) {
      console.error("Error manual user lookup:", userError.message);
      return res.status(500).json({ success: false, error: "Gagal mencari data siswa." });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        error: `Nama "${username}" tidak ditemukan di database. Pastikan nama sesuai dengan data yang terdaftar.`,
      });
    }

    const { data: attendanceData, error: insertError } = await supabase
      .from("attendances")
      .insert([
        {
          idcard: user.idcard,
          mac_address: "Manual Input",
          status: status || "Hadir",
          note: note || "Tidak ada catatan",
        },
      ])
      .select();

    if (insertError) {
      console.error("Error manual insert:", insertError.message);
      return res
        .status(500)
        .json({ success: false, error: "Gagal menyimpan absensi manual." });
    }

    res.json({
      success: true,
      message: `Absensi manual berhasil! ${user.username} tercatat dengan RFID ${user.idcard}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error manual attendance:", error.message);
    res.status(500).json({ success: false, error: "Terjadi kesalahan pada server." });
  }
};

const getAttendances = async (req, res) => {
  try {
    const { data: attendances, error: attError } = await supabase
      .from("attendances")
      .select("*")
      .order("created_at", { ascending: false });

    if (attError) {
      console.error("Error fetch attendances:", attError.message);
      throw attError;
    }

    if (!attendances || attendances.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("username, idcard, rombel, kelas, nis, rayon");

    if (userError) {
      console.error("Error fetch users:", userError.message);
    }

    const dataValidUsers = users || [];

    const dataGabungan = attendances.map((att) => {
      const idKartuAbsen = att.card_id || att.idcard || "";

      const userCocok = dataValidUsers.find((u) => {
        const idUser = u.idcard || u.card_id || "";
        return String(idUser).trim() === String(idKartuAbsen).trim();
      });

      return {
        ...att,
        idcard: idKartuAbsen,
        rombel: userCocok?.rombel || att.rombel || null,
        kelas: userCocok?.kelas || null,
        rayon: userCocok?.rayon || att.rayon || null,
        nis: userCocok?.nis ?? null,
        users: userCocok
          ? { username: userCocok.username || userCocok.name || "Siswa" }
          : null,
      };
    });

    res.json({ success: true, data: dataGabungan });
  } catch (error) {
    console.error("Error get attendances:", error.message);
    res.status(500).json({ success: false, error: "Gagal memuat data absensi." });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { time_finish, status, note } = req.body;

    const updateData = {};
    if (time_finish) updateData.time_finish = time_finish;
    if (status) updateData.status = status;
    if (note !== undefined) updateData.note = note;

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Tidak ada data yang diupdate" });
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from("attendances")
      .update(updateData)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error update attendance:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Data absensi tidak ditemukan" });
    }

    if (time_finish) {
      const { data: attRow } = await supabase
        .from("attendances")
        .select("idcard")
        .eq("id", id)
        .maybeSingle();

      if (attRow?.idcard) {
        const { data: userPulang } = await supabase
          .from("users")
          .select("username, rombel")
          .eq("idcard", String(attRow.idcard).trim())
          .maybeSingle();
      }
    }

    res.json({
      success: true,
      message: "Data absensi berhasil diupdate",
      data,
    });
  } catch (error) {
    console.error("Error put attendance:", error.message);
    res.status(500).json({ success: false, error: "Gagal memperbarui data absensi." });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("attendances")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error delete attendance:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "Data absensi tidak ditemukan" });
    }

    res.json({ success: true, message: "Data absensi berhasil dihapus" });
  } catch (error) {
    console.error("Error delete attendance:", error.message);
    res.status(500).json({ success: false, error: "Gagal menghapus data absensi." });
  }
};

const getUserAttendances = async (req, res) => {
  try {
    const { nis } = req.params;
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("idcard")
      .eq("nis", nis)
      .maybeSingle();

    if (userErr) {
      console.error("Error get user by nis:", userErr.message);
      throw userErr;
    }
    if (!user)
      return res
        .status(404)
        .json({ success: false, error: "Siswa tidak ditemukan" });

    const { data: attendances, error: attErr } = await supabase
      .from("attendances")
      .select("*")
      .eq("idcard", user.idcard)
      .order("created_at", { ascending: false })
      .limit(15);

    if (attErr) {
      console.error("Error fetch attendances:", attErr.message);
      throw attErr;
    }

    res.json({ success: true, data: attendances || [] });
  } catch (error) {
    console.error("Error get user attendances:", error.message);
    res.status(500).json({ success: false, error: "Gagal memuat riwayat absensi." });
  }
};

const formatDurationHelper = (sec) => {
  if (sec === null || sec === undefined) return "-";
  if (sec < 60) return `${sec} dtk`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m < 60) return s > 0 ? `${m} mnt ${s} dtk` : `${m} mnt`;
  const h = Math.floor(m / 60);
  const remM = m % 60;
  return remM > 0 ? `${h} jam ${remM} mnt` : `${h} jam`;
};

const getTrafficAnalytics = async (req, res) => {
  try {
    const { date, interval = "30", mode = "all" } = req.query;
    const intervalMinutes = Math.max(5, Math.min(120, parseInt(interval, 10) || 30));
    const { startWib, endWib } = rentangHariWIB(date);

    // Ambil data absensi pada rentang hari tersebut
    const { data: attendances, error: attError } = await supabase
      .from("attendances")
      .select("*")
      .gte("created_at", startWib)
      .lte("created_at", endWib)
      .order("created_at", { ascending: true });

    if (attError) {
      console.error("Error fetch attendances for traffic:", attError.message);
      throw attError;
    }

    // Ambil data users untuk mapping nama, NIS, rombel, kelas
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("username, idcard, rombel, kelas, nis, rayon");

    if (userError) {
      console.error("Error fetch users for traffic:", userError.message);
    }

    const dataValidUsers = users || [];
    const rawAttendances = attendances || [];

    // Ubah data absensi menjadi daftar Tap Events berurutan
    const tapEvents = [];

    rawAttendances.forEach((att) => {
      const idKartu = String(att.card_id || att.idcard || "").trim();
      const user = dataValidUsers.find(
        (u) => String(u.idcard || "").trim() === idKartu
      );

      // Tap Masuk
      if ((mode === "all" || mode === "masuk") && att.created_at) {
        tapEvents.push({
          id: `${att.id}-masuk`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "masuk",
          type_label: "Tap Masuk",
          status: att.status || "Hadir",
          mac_address: att.mac_address || "RFID Reader Card 135KHZ",
          note: att.note || "-",
          timestamp: new Date(att.created_at).getTime(),
          iso_time: att.created_at,
        });
      }

      // Tap Keluar
      if ((mode === "all" || mode === "keluar") && att.time_finish) {
        tapEvents.push({
          id: `${att.id}-keluar`,
          attendance_id: att.id,
          idcard: idKartu,
          username: user?.username || "Siswa",
          nis: user?.nis ?? "-",
          rombel: user?.rombel || att.rombel || "-",
          kelas: user?.kelas || "-",
          type: "keluar",
          type_label: "Tap Keluar",
          status: "Pulang",
          mac_address: att.mac_address || "RFID Reader Card 135KHZ",
          note: att.note || "-",
          timestamp: new Date(att.time_finish).getTime(),
          iso_time: att.time_finish,
        });
      }
    });

    // Urutkan secara kronologis (ascending)
    tapEvents.sort((a, b) => a.timestamp - b.timestamp);

    // Hitung jeda antar tap berurutan (dalam detik)
    let totalGapSeconds = 0;
    let gapCount = 0;
    let minGapSeconds = null;
    let maxGapSeconds = null;
    const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

    tapEvents.forEach((ev, idx) => {
      // Format jam WIB HH:mm:ss
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
        ev.jeda_formatted = formatDurationHelper(diffSec);

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

    // Analisis Waktu Puncak (Interval Analysis)
    const bucketMap = new Map();

    tapEvents.forEach((ev) => {
      const dateWib = new Date(ev.timestamp + WIB_OFFSET_MS);
      const h = dateWib.getUTCHours();
      const m = dateWib.getUTCMinutes();
      const totalMinutes = h * 60 + m;

      const slotStartMinutes = Math.floor(totalMinutes / intervalMinutes) * intervalMinutes;
      const slotEndMinutes = slotStartMinutes + intervalMinutes;

      const formatHHMM = (min) => {
        const hVal = Math.floor(min / 60) % 24;
        const mVal = min % 60;
        return `${String(hVal).padStart(2, "0")}:${String(mVal).padStart(2, "0")}`;
      };

      const key = `${formatHHMM(slotStartMinutes)} - ${formatHHMM(slotEndMinutes)}`;
      if (!bucketMap.has(key)) {
        bucketMap.set(key, {
          time_range: key,
          start_minutes: slotStartMinutes,
          end_minutes: slotEndMinutes,
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

    const buckets = Array.from(bucketMap.values()).sort(
      (a, b) => a.start_minutes - b.start_minutes
    );

    const maxTapsInBucket = Math.max(0, ...buckets.map((b) => b.total_taps));

    const peakAnalysisTable = buckets.map((b, idx) => {
      const avgGap =
        b.gaps.length > 0
          ? Math.round((b.gaps.reduce((acc, g) => acc + g, 0) / b.gaps.length) * 10) / 10
          : null;
      const minGap = b.gaps.length > 0 ? Math.min(...b.gaps) : null;
      const maxGap = b.gaps.length > 0 ? Math.max(...b.gaps) : null;
      const pct =
        tapEvents.length > 0
          ? Math.round((b.total_taps / tapEvents.length) * 1000) / 10
          : 0;

      let status = "Lengang";
      let status_badge = "success";
      let is_peak = false;

      if (b.total_taps === maxTapsInBucket && maxTapsInBucket > 0) {
        status = "PUNCAK UTAMA";
        status_badge = "danger";
        is_peak = true;
      } else if (b.total_taps >= maxTapsInBucket * 0.7 && maxTapsInBucket > 0) {
        status = "Sangat Ramai";
        status_badge = "warning";
      } else if (b.total_taps >= maxTapsInBucket * 0.35 && maxTapsInBucket > 0) {
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
        min_jeda_formatted: minGap !== null ? formatDurationHelper(minGap) : "-",
        max_jeda_seconds: maxGap,
        max_jeda_formatted: maxGap !== null ? formatDurationHelper(maxGap) : "-",
        status,
        status_badge,
        is_peak,
      };
    });

    const peakBucket = peakAnalysisTable.find((b) => b.is_peak) || null;
    const avgOverallGap =
      gapCount > 0 ? Math.round((totalGapSeconds / gapCount) * 10) / 10 : null;

    const targetDateStr =
      date || new Date(Date.now() + WIB_OFFSET_MS).toISOString().split("T")[0];

    res.json({
      success: true,
      query: {
        date: targetDateStr,
        interval: intervalMinutes,
        mode,
      },
      summary: {
        total_taps: tapEvents.length,
        peak_time_range: peakBucket ? peakBucket.time_range : "-",
        peak_taps: peakBucket ? peakBucket.total_taps : 0,
        peak_percentage: peakBucket ? peakBucket.percentage : 0,
        avg_interval_seconds: avgOverallGap,
        avg_interval_formatted: avgOverallGap !== null ? `${avgOverallGap} dtk` : "-",
        min_interval_seconds: minGapSeconds,
        min_interval_formatted: minGapSeconds !== null ? formatDurationHelper(minGapSeconds) : "-",
        max_interval_seconds: maxGapSeconds,
        max_interval_formatted: maxGapSeconds !== null ? formatDurationHelper(maxGapSeconds) : "-",
        peak_throughput_per_minute:
          peakBucket && intervalMinutes > 0
            ? Math.round((peakBucket.total_taps / intervalMinutes) * 10) / 10
            : 0,
      },
      peak_analysis: peakAnalysisTable,
      tap_logs: tapEvents.slice().reverse(), // Urutan log terbaru di atas
    });
  } catch (error) {
    console.error("Error get traffic analytics:", error.message);
    res.status(500).json({ success: false, error: "Gagal memuat analisis traffic absensi." });
  }
};

const autoCheckout = async (req, res) => {
  try {
    // Proteksi cron: jika CRON_SECRET diset, wajib cocok
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const auth = req.headers.authorization || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7) : req.query.secret;
      if (token !== secret) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
    }

    const { startWib, endWib } = rentangHariWIB();
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("attendances")
      .update({ time_finish: nowIso, updated_at: nowIso })
      .is("time_finish", null)
      .gte("created_at", startWib)
      .lte("created_at", endWib)
      .select("id");

    if (error) {
      console.error("Error auto-checkout:", error.message);
      return res.status(500).json({ success: false, message: "Gagal auto checkout." });
    }

    return res.json({
      success: true,
      message: `Auto checkout selesai. ${data?.length || 0} siswa di-set absen keluar.`,
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error auto-checkout:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
};

module.exports = {
  storeAttendance,
  tapAttendance,
  manualAttendance,
  getAttendances,
  getTrafficAnalytics,
  updateAttendance,
  deleteAttendance,
  getUserAttendances,
  autoCheckout,
};