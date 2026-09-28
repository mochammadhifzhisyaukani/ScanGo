const verifyAdmin = (req, res, next) => {
  const role = (req.user?.role || "").trim().toLowerCase();
  if (role !== "teacher" && role !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak! Halaman ini khusus untuk Guru.",
    });
  }

  next();
};

module.exports = verifyAdmin;