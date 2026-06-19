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

app.use(express.json());

app.post("/api/attendances/store", async (req, res) => {
  const apiToken = req.headers["api-token"];
  const { card_id, mac_address } = req.query;

  if (!apiToken) {
    return res.status(401).json({ message: "Unauthorized: Token tidak ada!" });
  }

  if (!card_id || !mac_address) {
    return res
      .status(400)
      .json({ message: "Data card_id atau mac_address kurang lengkap!" });
  }

  console.log(
    `AlAT RFID MENDETEKSI: Kartu ${card_id} di-tap di mesin ${mac_address}`,
  );

  try {
    const { data, error } = await supabase
      .from("attendances")
      .insert([{ card_id, mac_address, status: "hadir" }]);

    if (error) throw error;

    return res
      .status(200)
      .json({ success: true, message: "Absensi berhasil dicatat!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("nis, username, rombel, idcard, role")
      .order("username", { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/auth/register-bulk", async (req, res) => {
  const { users } = req.body;

  if (!users || !Array.isArray(users)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Format data Excel kosong atau salah!",
      });
  }

  try {
    const { data, error } = await supabase.from("users").insert(users);

    if (error) throw error;

    return res
      .status(200)
      .json({ success: true, message: "Import massal sukses!" });
  } catch (error) {
    console.error("Error Bulk Insert:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/users/:nis', async (req, res) => {
  const { nis } = req.params;

  try {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('nis', nis);

      if (error) throw error;

      return res.status(200).json({ success: true, message: "Data berhasil dihapus!" });
  } catch (error) {
    console.error("Error Delete: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:nis', async (req, res) => {
  const { nis } = req.params;
  const { username, email, rombel, role, idcard } = req.body;

  try {
    const { data, error } = await supabase
     .from('users')
     .update({ username, email, rombel, role, idcard })
     .eq('nis', nis);

    if (error) throw error;

    return res.status(200).json({ success: true, message: "Data berhasil diupdate!" });
  } catch (error) {
    console.error("Error saat update: ", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.use("/api/admin", authRoutes);
app.use("/api/auth", authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server STANDBY di: http://localhost:${PORT}`);
});
