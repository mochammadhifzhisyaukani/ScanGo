const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const supabase = require("./config/db");
const verifyToken = require("./middlewares/authMiddleware");
const verifyAdmin = require("./middlewares/adminMiddleware");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const ORIGIN_FRONTEND = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const WA_ENABLED = process.env.WA_ENABLED === "true";
const WA_GATEWAY_URL = process.env.WA_GATEWAY_URL || "";

function kirimNotifikasiWeb(siswa, jenis) {
  if (!WA_ENABLED) return;
  if (!siswa?.whatsapp) return;

  fetch(`${WA_GATEWAY_URL}/api/send-notification`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      whatsapp: siswa.whatsapp,
      username: siswa.username,
      rombel: siswa.rombel,
      jenis,
    }),
  })
    .then(() => console.log(`✅ Notifikasi WA (${jenis}) dikirim ke gateway.`))
    .catch((err) =>
      console.error("❌ Gagal hubungi gateway WhatsApp:", err.message),
    );
}

// Jendela "hari ini" berbasis WIB (UTC+7), bukan timezone server
function rentangHariWIB() {
  const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;
  const startWib = new Date(Date.now() + WIB_OFFSET_MS);
  startWib.setUTCHours(0, 0, 0, 0);
  const endWib = new Date(startWib.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { startWib: startWib.toISOString(), endWib: endWib.toISOString() };
}

// Helmet & body parser harus dipasang sebelum route
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// CORS: izinkan origin eksplisit (dari env) dan request same-origin.
// Request tanpa Origin header (curl, server-to-server) selalu diizinkan.
app.use(
  cors((req, callback) => {
    const origin = req.get("Origin");
    let allow = false;

    if (!origin) {
      allow = true;
    } else {
      const sameOrigin = (() => {
        const reqHost = req.get("host");
        if (!reqHost) return false;
        try {
          return new URL(origin).host === reqHost;
        } catch (e) {
          return false;
        }
      })();

      allow = ORIGIN_FRONTEND.includes(origin) || sameOrigin;
    }

    callback(null, {
      origin: allow,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization", "api-token"],
    });
  }),
);

// Rate limiter global sebelum route API
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1400,
  message: { success: false, message: "Terlalu banyak permintaan. Coba lagi nanti." }
});
app.use("/api", globalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.post("/api/attendances/store", verifyToken, async (req, res) => {
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

    const { data: attendanceData, error: insertError } = await supabase
      .from("attendances")
      .insert([
        {
          idcard,
          mac_address: mac_address || "RFID Reader Card 135KHZ",
          status: "Hadir",
        },
      ])
      .select();

    if (insertError) {
      console.error("Error insert attendance:", insertError.message);
      return res
        .status(500)
        .json({ success: false, message: "Gagal menyimpan absensi." });
    }

    kirimNotifikasiWeb(uservalid, "MASUK");

    res.json({
      success: true,
      message: `Absensi berhasil dicatat! Selamat belajar ${namaPemilik}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error store attendance:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
});

// Endpoint tap serbaguna: 1 request dari frontend, semua pengecekan di server.
// Body/query: idcard ATAU username, mode ("masuk"|"keluar"), mac_address?, status?, note?
app.post("/api/attendances/tap", verifyToken, async (req, res) => {
  try {
    const body = req.body || {};
    const query = req.query || {};
    const rawIdcard = String(body.idcard ?? query.idcard ?? "").trim();
    const rawUsername = String(body.username ?? query.username ?? "").trim();
    const mode = String(body.mode ?? query.mode ?? "masuk") === "keluar" ? "keluar" : "masuk";
    const macAddress = body.mac_address ?? query.mac_address ?? null;
    const statusInput = typeof body.status === "string" ? body.status.trim() : "";
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
      const insertPayload = {
        idcard: byIdcard ? rawIdcard : String(uservalid.idcard),
        mac_address: macAddress || macDefault,
        status: statusInput || "Hadir",
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

      kirimNotifikasiWeb(uservalid, "MASUK");

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

    kirimNotifikasiWeb(uservalid, "PULANG");

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
});

app.post("/api/attendances/manual", verifyToken, async (req, res) => {
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

    kirimNotifikasiWeb(user, "MASUK");

    res.json({
      success: true,
      message: `Absensi manual berhasil! ${user.username} tercatat dengan RFID ${user.idcard}`,
      data: attendanceData,
    });
  } catch (error) {
    console.error("Error manual attendance:", error.message);
    res.status(500).json({ success: false, error: "Terjadi kesalahan pada server." });
  }
});

app.get("/api/attendances", verifyToken, async (req, res) => {
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
});

app.put("/api/attendances/:id", verifyToken, async (req, res) => {
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
          .select("username, rombel, whatsapp")
          .eq("idcard", String(attRow.idcard).trim())
          .maybeSingle();

        kirimNotifikasiWeb(userPulang, "PULANG");
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
});

app.delete("/api/attendances/:id", verifyToken, async (req, res) => {
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
});

app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetch users:", error.message);
      throw error;
    }

    res.json({ success: true, data: users || [] });
  } catch (error) {
    console.error("Error get users:", error.message);
    res.status(500).json({ success: false, message: "Gagal memuat data pengguna." });
  }
});

app.get("/api/users/:nis", verifyToken, async (req, res) => {
  const { nis } = req.params;
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("nis", nis)
      .maybeSingle();

    if (error) {
      console.error("Error get user by nis:", error.message);
      throw error;
    }
    if (!data)
      return res
        .status(404)
        .json({ success: false, error: "Siswa tidak ditemukan" });

    res.json({ success: true, user: data });
  } catch (error) {
    console.error("Error get user by nis:", error.message);
    res.status(500).json({ success: false, message: "Gagal memuat data siswa." });
  }
});

app.put("/api/users/id/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ success: false, message: "ID tidak valid." });
  }

  const { username, email, rombel, role, idcard, whatsapp, rayon, kelas, nis } = req.body;

  if (nis !== undefined && nis !== null && String(nis).trim() !== "" && !/^\d+$/.test(String(nis).trim())) {
    return res
      .status(400)
      .json({ success: false, message: "NIS/NIP harus berupa angka." });
  }

  const updates = {};
  if (username) updates.username = username;
  if (email) updates.email = email;
  if (rombel) updates.rombel = rombel;
  if (role) updates.role = role;
  if (idcard) updates.idcard = idcard;
  if (whatsapp) updates.whatsapp = whatsapp;
  if (rayon) updates.rayon = rayon;
  if (kelas) updates.kelas = kelas;
  if (nis !== undefined && String(nis).trim() !== "") {
    updates.nis = Number(String(nis).trim());
  }

  if (Object.keys(updates).length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Tidak ada data untuk diupdate." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select("id");

    if (error) {
      console.error("Error update user:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Data berhasil diupdate!" });
  } catch (error) {
    console.error("Error update user catch:", error.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan saat memperbarui data." });
  }
});

app.delete("/api/users/id/:id", verifyToken, verifyAdmin, async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ success: false, message: "ID tidak valid." });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", userId)
      .select("id");

    if (error) {
      console.error("Error delete user:", error.message);
      throw error;
    }

    if (!data || data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan." });
    }

    return res
      .status(200)
      .json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    console.error("Error delete user catch:", error.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan saat menghapus data." });
  }
});

app.get("/api/users/:nis/attendances", verifyToken, async (req, res) => {
  const { nis } = req.params;
  try {
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
});

app.post("/api/auth/register-bulk", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Data users tidak valid atau kosong!",
      });
    }

    const usersNormalized = users.map((u) => ({
      ...u,
      idcard: u.idcard !== "" && u.idcard != null ? Number(u.idcard) : null,
      nis: u.nis !== "" && u.nis != null ? Number(u.nis) : null,
    }));

    const hasNonNumeric = users.some(
      (u) =>
        (u.idcard !== "" && u.idcard != null && !/^\d+$/.test(String(u.idcard))) ||
        (u.nis !== "" && u.nis != null && !/^\d+$/.test(String(u.nis))),
    );

    if (hasNonNumeric) {
      return res.status(400).json({
        success: false,
        message: "Terdapat data dengan ID kartu/NIS yang bukan angka!",
      });
    }

    const { data, error } = await supabase.from("users").insert(usersNormalized).select();
    if (error) throw error;

    res.json({
      success: true,
      message: `${data.length} data berhasil disimpan!`,
      data,
    });
  } catch (error) {
    console.error("Error register-bulk:", error.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan saat menyimpan data." });
  }
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server STANDBY di: http://localhost:${PORT}`);
  });
}

module.exports = app;
