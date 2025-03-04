const express = require("express");
const Order = require("../models/order");
const Cart = require("../models/cart");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Taoj đơn hàng
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ message: "Giỏ hàng trống, không thể tạo đơn hàng" });
    }

    // Tạo đơn hàng từ giỏ hàng
    const newOrder = new Order({
      userId,
      items: cart.items,
      total: cart.total,
      status: "Pending",
    });
    await newOrder.save();
    await Cart.findOneAndDelete({ userId });
    res.json({ message: "Đơn hàng đã được tạo thành công", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

//Xác nhận đơn hàng
router.put("/orderId/confirm", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    });
    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    order.status = "Confirmed";
    await order.save();

    res.json({ message: "Đơn hàng đã được xác nhận", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Hủy đơn hàng
router.put("/orderId/cancel", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    });
    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    order.status = "Cancelled";
    await order.save();
    res.json({ message: "Đơn hàng đã bị hủy", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Xem danh sách đơn hàng của user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Xem chi tiết đơn hàng
router.get("/orderId", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      userId: req.user.id,
    });
    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Quản lý trạng thái đơn hàng
router.put("/orderId/status", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền thay đổi trạng thái đơn hàng" });
    }
    const order = await Order.findById(req.params.orderId);
    if (!order)
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    order.status = req.body.status;
    await order.save();
    res.json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
