const express = require("express");
const router = express.Router();
// Auth middleware disabled
const verifyToken = (req, res, next) => next();
const verifyAdmin = (req, res, next) => next();

router.get(
  "/dashboard-data",
  verifyToken,
  verifyAdmin,
  (req, res) => {
    res.status(200).json({
      message: "API Dashboard Admin",
      stats: {
        totalUsers: 125,
        totalScans: 450,
        activeLogins: 12,
      },
    });
  }
);

module.exports = router;