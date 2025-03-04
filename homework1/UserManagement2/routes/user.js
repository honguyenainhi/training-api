const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Lấy thông tin user
/**
 * @param {string} email email
 * @param {string} password mật khẩu mới
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// cap nhap profile
/**
 * @param {string} email email
 * @param {string} username tên mới
 * @param {string} password mật khẩu mới
 * @param {string} newPassword mật khẩu mới
 * @param {string} newEmail email mới
 */
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { username, newPassword, currentPassword } = req.body;

    // Cập nhật username nếu có
    if (username) req.user.username = username;

    // Cập nhật mật khẩu nếu có yêu cầu đổi
    if (newPassword) {
      if (!currentPassword || req.user.password !== currentPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }
      req.user.password = newPassword;
    }

    await req.user.save();
    res.json({ message: "Cập nhật thành công", user: req.user });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});
//dang xuat
/**
 * @param {string} email email
 */
router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(400).json({ message: "User not found" });
    user.accessToken = null;
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
