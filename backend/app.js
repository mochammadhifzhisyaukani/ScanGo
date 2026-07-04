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

const ORIGIN_FRONTEND = process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: ORIGIN_FRONTEND,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "api-token"],
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

app.use(helmet());
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: "Terlalu banyak permintaan. Coba lagi nanti." }
});

app.use("/api", globalLimiter);

app.post("/api/attendances/store", verifyToken, async (req, res) => {
  try {
    const idcard = req.query.idcard;
    const mac_address = req.query.mac_address;

    if (!idcard) {
      return res
        .status(400)
        .json({ success: false, message: "UID Kartu tidak terbaca" });
    }

    const { data: uservalid, error: userError } = await supabase
      .from("users")
      .select("username, idcard")
      .eq("idcard", idcard)
      .maybeSingle();

    if (userError) {
      console.error("Error store user lookup:", userError.message);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan saat memverifikasi kartu." });
    }

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const namaPemilik = uservalid.username || "Siswa";

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const { data: existing, error: existingError } = await supabase
      .from("attendances")
      .select("id, time_finish")
      .eq("idcard", idcard)
      .gte("created_at", todayStart.toISOString())
      .lte("created_at", todayEnd.toISOString())
      .maybeSingle();

    if (existingError) {
      console.error("Error check existing:", existingError.message);
      throw existingError;
    }

    if (existing) {
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

app.post("/api/attendances/manual", verifyToken, async (req, res) => {
  try {
    const { username, status, keterangan } = req.body;

    if (!username || !username.trim()) {
      return res
        .status(400)
        .json({ success: false, error: "Nama siswa wajib diisi!" });
    }

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("username, idcard")
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
          note: keterangan || null,
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
      .select("*");

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

app.put("/api/users/:nis", verifyToken, verifyAdmin, async (req, res) => {
  const { nis } = req.params;
  const { username, email, rombel, role, idcard } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ username, email, rombel, role, idcard })
      .eq("nis", nis);

    if (error) {
      console.error("Error update user:", error.message);
      throw error;
    }

    return res
      .status(200)
      .json({ success: true, message: "Data berhasil diupdate!" });
  } catch (error) {
    console.error("Error update user catch:", error.message);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan saat memperbarui data." });
  }
});

app.delete("/api/users/:nis", verifyToken, verifyAdmin, async (req, res) => {
  const { nis } = req.params;
  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("nis", nis);

    if (error) {
      console.error("Error delete user:", error.message);
      throw error;
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

    const { data, error } = await supabase.from("users").insert(users).select();
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
app.listen(PORT, () => {
  console.log(`Server STANDBY di: http://localhost:${PORT}`);
});
