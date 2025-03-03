const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Đăng ký.
/**
 *@param {string} username - Tên đăng nhập
 * @param {string} email - Email đăng nhập
 * @param {string} password - Mật khẩu đăng nhập
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // kiem tra email da duoc ton tai chua
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });
    //hashedPassword truoc khi luu vao db
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save(); // luu user vao db

    // Tạo token xác thực email
    const verifyToken = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    // cau hinh de email xac thuc
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // noi dung de email xac thuc: dia chi nguoi goi, dia chi nguoi nhan,..
    /**
     * @param {string} from - Địa chỉ email của người gửi
     * @param {string} to - Địa chỉ email của người nhận
     * @param {string} subject - Tiêu đề của email
     * @param {string} text - Nội dung email chứa link xác thực tài khoản
     */
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Xác thực Email",
      text: `Click vào link sau để xác thực tài khoản: http://yourfrontend.com/verify-email?token=${verifyToken}`,
    };
    // goi email xác thực
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Gửi email thất bại", error });
      }
      res.status(201).json({
        message:
          "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản!",
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message }); // xu ly neu co loi
  }
});

// Xác thực email khi dang ki
/**
 * @param {token} token xác thực email
 */
router.get("/verify-email", async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "User không tồn tại" });

    // Cập nhật trạng thái xác thực
    user.isVerified = true;
    await user.save();

    res.json({ message: "Email đã được xác thực thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Dang nhập
/**
 * @param {string} email - Email đăng nhập
 * @param {string} password - Mật khẩu đăng nhập
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Tài khoản không tồn tại" });

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác" });

    // Tạo JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token có hiệu lực trong 1 giờ
    );

    res.json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// xac nhận email xác nhận tài khoản
/**
 * @param {string} email - Email đã đăng ký
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // Tạo token reset
    const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m", // Token có hiệu lực trong 10phút
    });

    // cau hinh nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    //mailOptions co thong tin email goi di
    /**
     * @param{string} from - Email người gửi
     * @param{string} to - Email người nhận
     * @param{string} subject - tieu de
     * @param{string} text - Nội dung email
     */
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset mật khẩu",
      text: `Click vào link này để đặt lại mật khẩu: http://yourfrontend.com/reset-password?token=${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: "Gửi email thất bại", error });
      }
      res.json({ message: "Vui lòng kiểm tra email để đặt lại mật khẩu" });
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// đặt lại mật khẩu
/**
 * @param {string} token - Token xác thực email
 * @param {string} newPassword - Mật khẩu mới
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).json({ message: "User không tồn tại" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
