const supabase = require("../config/db");

const getUsers = async (req, res) => {
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
};

const getUserByNis = async (req, res) => {
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
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const userId = Number(id);
  if (!Number.isInteger(userId) || userId <= 0) {
    return res.status(400).json({ success: false, message: "ID tidak valid." });
  }

  const { username, email, rombel, role, idcard, whatsapp, rayon, kelas, nis, jenisKelamin } = req.body;

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
  if (jenisKelamin) updates.jenisKelamin = jenisKelamin;
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
};

const deleteUser = async (req, res) => {
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
};

module.exports = {
  getUsers,
  getUserByNis,
  updateUser,
  deleteUser,
};