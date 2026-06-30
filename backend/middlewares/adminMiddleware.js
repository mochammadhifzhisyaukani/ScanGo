const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role.trim().toLowerCase() !== "admin") {
    return res.status(403).json({
      message: "Akses ditolak! Halaman ini khusus untuk Admin.",
    });
  }

  next();
};

module.exports = verifyAdmin;