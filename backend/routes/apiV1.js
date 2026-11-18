const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const authController = require("../controllers/authController");
const {
  storeAttendance,
  tapAttendance,
  manualAttendance,
  getAttendances,
  getTrafficAnalytics,
  updateAttendance,
  deleteAttendance,
  getUserAttendances,
} = require("../controllers/attendanceController");
const {
  getUsers,
  getUserByNis,
  updateUser,
  deleteUser,
} = require("../controllers/userController");


// Auth middleware disabled - all endpoints are public
const verifyToken = (req, res, next) => next();
const verifyAdmin = (req, res, next) => next();

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
router.post("/login", apiLimiter, authController.login);

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

/**
 * @route GET /api/v1/attendances
 * @desc Get all attendance records (admin only)
 * @access Private + Admin
 */
router.get(
  "/attendances",
  verifyToken,
  verifyAdmin,
  getAttendances
);

/**
 * @route GET /api/v1/attendances/traffic
 * @desc Get card tap traffic & peak attendance analysis
 * @access Private + Admin
 */
router.get(
  "/attendances/traffic",
  verifyToken,
  getTrafficAnalytics
);

/**
 * @route POST /api/v1/attendances/store
 * @desc Store attendance via RFID card scan
 * @access Private
 */
router.post(
  "/attendances/store",
  verifyToken,
  storeAttendance
);

/**
 * @route POST /api/v1/attendances/tap
 * @desc Manual attendance entry (RFID or username)
 * @access Private
 */
router.post(
  "/attendances/tap",
  verifyToken,
  tapAttendance
);

/**
 * @route POST /api/v1/attendances/manual
 * @desc Manual attendance entry by name
 * @access Private
 */
router.post(
  "/attendances/manual",
  verifyToken,
  manualAttendance
);

/**
 * @route PUT /api/v1/attendances/:id
 * @desc Update attendance record (admin only)
 * @access Private + Admin
 */
router.put(
  "/attendances/:id",
  verifyToken,
  verifyAdmin,
  updateAttendance
);

/**
 * @route DELETE /api/v1/attendances/:id
 * @desc Delete attendance record (admin only)
 * @access Private + Admin
 */
router.delete(
  "/attendances/:id",
  verifyToken,
  verifyAdmin,
  deleteAttendance
);

/**
 * @route GET /api/v1/users
 * @desc Get all users (admin only)
 * @access Private + Admin
 */
router.get("/users", verifyToken, verifyAdmin, getUsers);

/**
 * @route GET /api/v1/users/:nis
 * @desc Get user by NIS (authenticated users)
 * @access Private
 */
router.get("/users/:nis", verifyToken, getUserByNis);

/**
 * @route PUT /api/v1/users/id/:id
 * @desc Update user by ID (admin only)
 * @access Private + Admin
 */
router.put(
  "/users/id/:id",
  verifyToken,
  verifyAdmin,
  updateUser
);

/**
 * @route DELETE /api/v1/users/id/:id
 * @desc Delete user by ID (admin only)
 * @access Private + Admin
 */
router.delete(
  "/users/id/:id",
  verifyToken,
  verifyAdmin,
  deleteUser
);

/**
 * @route GET /api/v1/users/:nis/attendances
 * @desc Get attendance history by NIS
 * @access Private
 */
router.get(
  "/users/:nis/attendances",
  verifyToken,
  getUserAttendances
);

module.exports = router;