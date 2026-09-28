const supabase = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const resolveUserRole = (role, req) => {
  const requested = String(role || "").trim().toLowerCase();

  const publicRoles = ["student", "user"];
  if (publicRoles.includes(requested)) {
    return requested;
  }

  // Role "teacher" hanya boleh dibuat oleh admin/guru yang sudah login.
  if (requested === "teacher") {
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (token) {
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET, {
          algorithms: ["HS256"],
        });
        const callerRole = (verified.role || "").trim().toLowerCase();
        if (callerRole === "teacher" || callerRole === "admin") {
          return "teacher";
        }
      } catch (error) {
        // token tidak valid → perlakukan sebagai registrasi publik
      }
    }
  }

  return "student";
};

const register = async (req, res) => {
  try {
    const { email, password, role, username, idcard, rombel, nis, whatsapp, rayon, kelas } = req.body;

    const userRole = resolveUserRole(role, req);
    const isTeacher = userRole === "teacher";

    if (
      !email ||
      !password ||
      !username ||
      !idcard ||
      !userRole ||
      !rombel ||
      !nis ||
      !whatsapp || 
      !rayon ||
      (!isTeacher && !kelas)
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

    if (!/^\d+$/.test(String(idcard)) || !/^\d+$/.test(String(nis))) {
      return res.status(400).json({
        message: "ID kartu dan NIS harus berupa angka!",
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const idcardNum = Number(idcard);
    const nisNum = Number(nis);

    // Registrasi publik dibatasi ke role student/user.
    // Role "teacher" diizinkan bila request berasal dari admin/guru yang login.
    // Registrasi publik dibatasi ke role student/user.
    // Role "teacher" diizinkan bila request berasal dari admin/guru yang login.
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          password: hashedPassword,
          role: userRole,
          username: username,
          idcard: idcardNum,
          rombel: rombel,
          nis: nisNum,
          whatsapp: whatsapp,
          rayon: rayon,
          kelas: isTeacher && !kelas ? null : kelas
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
        nis: data[0].nis,
        whatsapp: data[0].whatsapp,
        rayon: data[0].rayon,
        kelas: data[0].kelas
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
        nis: user.nis,
        whatsapp: user.whatsapp,
        rayon: user.rayon,
        kelas: user.kelas
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

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
        nis: user.nis,
        whatsapp: user.whatsapp,
        rayon: user.rayon,
        kelas: user.kelas
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
