const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./User");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../utils/email");
const router = express.Router();
// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    user.emailVerificationToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await user.save();
    sendVerificationEmail(user.email, user.emailVerificationToken);
    res
      .status(201)
      .json({ message: "User registered. Please verify your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: "Please verify your email first" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
