const express = require("express");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/role");
const router = express.Router();

// khiem tra neu la admin moi thay duoc noi dung
router.get("/dashboard", auth, checkRole(["admin"]), (req, res) => {
  res.json({ message: "Chào mừng Admin" });
});

// lay tat ca danh sach user
router.get("/users", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách user", error: error.message });
  }
});

module.exports = router;
