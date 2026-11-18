const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const verifyToken = (req, res, next) => next();

const loginLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10,
  message: { message: "Terlalu banyak percobaan login! Coba Kembali nanti." },
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Terlalu banyak aksi dilakukan! Tolong beri jeda beberapa saat.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * @route POST /api/v1/auth/register
 * @desc Register new user (public, rate-limited)
 * @access Public
 */
router.post("/register", apiLimiter, authController.register);

/**
 * @route POST /api/v1/auth/login
 * @desc Login user (public, rate-limited)
 * @access Public
 */
router.post("/login", loginLimiter, authController.login);

/**
 * @route GET /api/v1/auth/test-vip
 * @desc Test VIP access (authenticated users)
 * @access Private
 */
router.get("/test-vip", apiLimiter, verifyToken, (req, res) => {
  res.status(200).json({
    message: "Berhasil masuk ke ruangan vip!",
    userAkses: req.user,
  });
});

/**
 * @route POST /api/v1/auth/logout
 * @desc Logout user (clears cookie)
 * @access Public
 */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.json({ success: true, message: "Logout berhasil!" });
});

module.exports = router;