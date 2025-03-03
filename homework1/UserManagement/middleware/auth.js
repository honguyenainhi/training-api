const jwt = require("jsonwebtoken");
// xac thuc token co ton tai hay khong
/**
 * @param {Object} req - Đối tượng request từ client
 * @param {Object} res - Đối tượng response gửi về client
 * @param {Function} next - Hàm tiếp tục middleware tiếp theo nếu xác thực thành công
 * @param {string} tokenSecret - Chuoii bí mật để mã hóa token
 */
module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res
      .status(401)
      .json({ message: "Khong co token, từ chối truy cập " });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token không hợp lệ" });
  }
};
