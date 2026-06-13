const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Terlalu banyak percobaan login! Coba Kembali nanti.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authController.register);
router.post("/login", loginLimiter, authController.login);

router.get("/test-vip", verifyToken, (req, res) => {
  res.status(200).json({
    message: "Berhasil masuk ke ruangan vip!",
    userAkses: req.user,
  });
});

module.exports = router;
