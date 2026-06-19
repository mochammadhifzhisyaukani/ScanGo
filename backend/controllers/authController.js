const supabase = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, role, username, idcard, rombel, nis } = req.body;

    if (
      !email ||
      !password ||
      !username ||
      !idcard ||
      !role ||
      !rombel ||
      !nis
    ) {
      return res.status(400).json({
        message: "Semua kolom input wajib diisi!",
      });
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        message: "Email sudah terdaftar!",
      });
    }

    const { data: existingUsername } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();

    if (existingUsername) {
      return res.status(400).json({
        message: "Username sudah digunakan!",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userRole = role || "user";

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          password: hashedPassword,
          role: userRole,
          username: username,
          idcard: idcard,
          rombel: rombel,
          nis: nis
        },
      ])
      .select();

    if (error) throw error;

    return res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id: data[0].id,
        email: data[0].email,
        role: data[0].role,
        username: data[0].username,
        idcard: data[0].idcard,
        rombel: data[0].rombel,
        nis: data[0].nis
      },
    });
  } catch (error) {
    console.error("Error Register: ", error.message);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email dan password wajib diisi!",
      });
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({
        message: "Email atau password salah!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password salah!",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        username: user.username,
        idcard: user.idcard,
        rombel: user.rombel,
        nis: user.nis
      },
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
        username: user.username,
        idcard: user.idcard,
        rombel: user.rombel,
        nis: user.nis
      },
    });
  } catch (error) {
    console.error("Error Login: ", error.message);
    return res.status(500).json({
      message: "Terjadi kesalahan pada server.",
    });
  }
};

module.exports = {
  register,
  login,
};
