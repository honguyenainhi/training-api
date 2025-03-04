const User = require("../models/user");

const adminMiddleware = async (req, res, next) => {
  try {
    // Lấy accessToken từ Header
    const accessToken = req.header("Authorization")?.split(" ")[1];

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Không có token, quyền truy cập bị từ chối" });
    }

    // Tìm user theo accessToken
    const user = await User.findOne({ accessToken });

    // Kiểm tra xem user có tồn tại và có quyền admin không
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Bạn không có quyền truy cập" });
    }

    req.user = user; // Gán user vào request để sử dụng trong các route tiếp theo
    next(); // Cho phép tiếp tục xử lý request
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = adminMiddleware;
