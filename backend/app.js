const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");
const supabase = require("./config/db");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "api-token"],
  }),
);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "api-token"],
  }),
);

app.use("/api/admin", authRoutes);

app.use(express.json());

app.post("/api/attendances/store", async (req, res) => {
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
      return res
        .status(500)
        .json({ success: false, message: userError.message });
    }

    if (!uservalid) {
      return res.status(403).json({
        success: false,
        message: "ID RFID tidak dikenali! Silahkan registrasi terlebih dahulu.",
      });
    }

    const namaPemilik = uservalid.username || "Siswa";

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
      return res
        .status(500)
        .json({ success: false, message: insertError.message });
    }

    res.json({
      success: true,
      message: `Absensi berhasil dicatat! Selamat belajar ${namaPemilik}`,
      data: attendanceData,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/attendances", async (req, res) => {
  try {
    const { data: attendances, error: attError } = await supabase
      .from("attendances")
      .select("*")
      .order("created_at", { ascending: false });

    if (attError) throw attError;

    if (!attendances || attendances.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const { data: users, error: userError } = await supabase
      .from("users")
      .select("*");

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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/users/:nis/attendances", async (req, res) => {
  const { nis } = req.params;
  try {
    // Ambil data user berdasarkan NIS untuk dapat idcard-nya
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("idcard")
      .eq("nis", nis)
      .maybeSingle();

    if (userErr) throw userErr;
    if (!user) return res.status(404).json({ success: false, error: "Siswa tidak ditemukan" });

    // Ambil 15 riwayat absensi terakhir berdasarkan idcard
    const { data: attendances, error: attErr } = await supabase
      .from("attendances")
      .select("*")
      .eq("idcard", user.idcard)
      .order("created_at", { ascending: false })
      .limit(15);

    if (attErr) throw attErr;

    res.json({ success: true, data: attendances || [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/users/:nis", async (req, res) => {
  const { nis } = req.params;

  try {
    const { data, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("nis", nis)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (!data) {
      return res.status(404).json({ success: false, error: "Siswa tidak ditemukan" });
    }

    res.json({
      success: true,
      user: data,
    });

  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Data tidak ditemukan",
    });
  }
})

app.delete("/api/users/:nis", async (req, res) => {
  const { nis } = req.params;

  try {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("nis", nis);

    if (error) throw error;

    return res
      .status(200)
      .json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    console.error("Error Delete: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put("/api/users/:nis", async (req, res) => {
  const { nis } = req.params;
  const { username, email, rombel, role, idcard } = req.body;

  try {
    const { data, error } = await supabase
      .from("users")
      .update({ username, email, rombel, role, idcard })
      .eq("nis", nis);

    if (error) throw error;

    return res
      .status(200)
      .json({ success: true, message: "Data berhasil diupdate!" });
  } catch (error) {
    console.error("Error saat update: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/api/attendances", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/register-bulk", async (req, res) => {
  try {
    const { users } = req.body;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ success: false, message: "Data users tidak valid atau kosong!" });
    }

    const { data, error } = await supabase.from("users").insert(users).select();
    if (error) throw error;

    res.json({ success: true, message: `${data.length} data berhasil disimpan!`, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.use("/api/admin", authRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server STANDBY di: http://localhost:${PORT}`);
});
