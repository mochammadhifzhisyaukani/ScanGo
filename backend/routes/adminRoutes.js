const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const verifyAdmin = require("../middlewares/adminMiddleware");

router.get("/dashboard-data", verifyToken, verifyAdmin, (req, res) => {
  res.status(200).json({
    message: "Selamat data di API Dashboard Admin!",
    stats: {
      totalUsers: 125,
      totalScans: 450,
      activeLogins: 12,
    },
  });
});

module.exports = router;
