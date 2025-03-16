const express = require("express");
const {
  register,
  login,
  getMe,
  logout,
} = require("../server/controllers/authController");
const { protect } = require("../server/middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);

module.exports = router;
