const supabase = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },

        buttonsStyling: false,
      });
      return;
    }

    const userRole = role || "user";

    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      showToast("Email dan Password sudah terdaftar", "danger");
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-success",
        },

        buttonsStyling: false,
      });
      return
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email: email, password: hashedPassword, role: userRole }])
      .select();

    if (error) throw error;

    return res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id: data[0].id,
        email: data[0].email,
        role: data[0].role,
      },
    });
  } catch (error) {
    console.error("Error Register: ", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email dan password wajib diisi!" });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res
        .status(401)
        .json({ message: "Email atau password salah! cek kembali." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah!" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECREET || "Secreet__",
      { expiresIn: "1d" },
    );

    return res.status(200).json({
      message: "Login berhasil!",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error Login: ", error.message);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
};

module.exports = {
  register,
  login,
};
