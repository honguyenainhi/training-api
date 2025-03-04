const express = require("express");

const User = require("../models/user");
const adminMiddleware = require("../middlewares/adminMiddleware");

const router = express.Router();

// Lấy danh sách users(Adim)
router.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
