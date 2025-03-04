const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // Lấy accessToken từ Header
    const accessToken = req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    // Tìm user theo accessToken
    const user = await User.findOne({ accessToken });

    if (!user) {
      return res.status(401).json({ message: "Token không hợp lệ" });
    }

    req.user = user; // Gán thông tin user vào request để sử dụng trong các route tiếp theo
    next(); // Cho phép tiếp tục xử lý request
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = authMiddleware;
