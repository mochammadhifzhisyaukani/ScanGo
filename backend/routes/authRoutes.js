const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

const loginLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
  message: { message: "Terlalu banyak percobaan login! Coba Kembali nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    message: "Terlalu banyak aksi dilakukan! Tolong beri jeda beberapa saat.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", apiLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);

router.get("/test-vip", apiLimiter, verifyToken, (req, res) => {
  res.status(200).json({
    message: "Berhasil masuk ke ruangan vip!",
    userAkses: req.user,
  });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logout berhasil!" });
});

module.exports = router;
