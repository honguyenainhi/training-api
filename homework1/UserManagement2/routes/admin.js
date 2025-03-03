const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/admin");

const router = express.Router();
// dang ki
/**
 * @param {string} username tên đăng nhập
 * @param {string} password mật khẩu
 * @param {string} email email
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email da duoc su dung" });
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: "Registered successfully. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Xác thực email
/**
 * @param {string} token token xác thực email
 */
router.post("/verify-email", async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.isVerified = true;
    await user.save();
    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//dang nhap
/**
 * @param {string} email email
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });
    const accessToken = uuidv4();
    user.accessToken = accessToken;
    await user.save();
    res.json({ message: "Login successful", accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//dang xuat
/**
 * @param {string} email email
 */
router.post("/logout", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    user.accessToken = null;
    await user.save();
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Lấy thông tin user
/**
 * @param {string} email email
 * @param {string} password mật khẩu mới
 */
router.get("/me", async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email });
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
router.put("/update-profile", async (req, res) => {
  try {
    const { email, username } = req.body;
    const user = await User.findOneAndUpdate(
      { email },
      { username },
      { new: true }
    );
    if (!user) return res.status(400).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Lấy danh sách users(Adim)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Yêu cầu đặt lại mật khẩu
/**
 * @param {string} email email
 */
router.post("/request-reset-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });
    // console.log(🔑 Reset Password Link: http://yourfrontend.com/reset-password?token=${user._id});
    res.json({ message: "Password reset email simulated. Check console log." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Quên mật khẩu
/**
 * @param {string} token token xác thực email
 * @param {string} newPassword mật khẩu mới
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findById(token);
    if (!user) return res.status(400).json({ message: "Invalid token" });
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Gửi lại email xác thực
/**
 * @param {string} email email
 */
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    res.json({
      message: "Resend verification email simulated. Check console log.",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
