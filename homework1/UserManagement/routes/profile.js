const express = require("express");
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// lấy thông tin user
/**
 * @route GET /me
 * @description Lấy thông tin người dùng hiện tại
 * @access Private (Yêu cầu đăng nhập)
 */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User không tồn tại" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// Cập nhật thông tin user
/**
 * @param {string} username - Tên đăng nhập mới
 * @param {string} email - Email mới
 */
router.put("/update", auth, async (req, res) => {
  try {
    const { username, email } = req.body;
    // Kiểm tra nếu đổi email thì phải kiểm tra trùng lặp
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== req.user.userId)
        return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { username, email },
      { new: true, runValidators: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// doi mat khau
/**
 * @param {string} oldPassword - Mật khẩu cu
 * @param {string} newPassword - Mật khẩu mới
 */
router.put("/change-password", auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: "User không tồn tại" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

module.exports = router;
