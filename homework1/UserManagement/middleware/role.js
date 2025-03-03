//phan quyen admin va user
/**
 *
 * @param {Array} roles - mang chua cac quyen user
 * @param {Object} req - object request
 * @param {Object} res - object response
 * @param {Function} next - ham tiep tuc middleware tiep theo
 */
module.exports = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập tài nguyên này" });
    }
    next();
  };
};
