const supabase = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { email, password, role, username } = req.body;

    if (!email || !password || !username) {
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
    const username = username || "username";

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
      return;
    }

    const { data: existingUsername } = await supabase
      .from("users")
      .select("username")
      .eq("username", username)
      .maybeSingle();
    
    if (existingUsername) {
      return res.status(400).json({
        message: "Username sudah digunakan!"
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from("users")
      .insert([{ email: email, password: hashedPassword, role: userRole, username: username }])
      .select();

    if (error) throw error;

    return res.status(201).json({
      message: "Registrasi berhasil!",
      user: {
        id: data[0].id,
        email: data[0].email,
        role: data[0].role,
        username: data[0].username
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
      showToast("Email dan Password wajib diisi!.", "danger");
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },

        buttonsStyling: false,
      });
      return;
    }

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (error || !user) {
      showToast("Email dan Password Salah! Cek kembali.", "danger");
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },

        buttonsStyling: false,
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      showToast("Email dan Password Salah!", "danger");
      Swal.fire({
        title: "Login Gagal",
        icon: "error",
        draggable: true,
        customClass: {
          popup: "sweetalert-popup",
          confirmButton: "sweetalert-btn-error",
        },

        buttonsStyling: false,
      });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
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
    showToast("ERRPR: ", "danger", error.message);
    Swal.fire({
      title: "Login Gagal",
      icon: "error",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-error",
      },

      buttonsStyling: false,
    });
    return;
    console.error("Error Login: ", error.message);
    showToast("Terjadi kesalahan pada server.", "danger");
    Swal.fire({
      title: "Kesalahan sistem",
      icon: "question",
      draggable: true,
      customClass: {
        popup: "sweetalert-popup",
        confirmButton: "sweetalert-btn-error",
      },

      buttonsStyling: false,
    });
    return;
  }
};

module.exports = {
  register,
  login,
};
