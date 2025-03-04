const express = require("express");
const Cart = require("../models/cart");
const Product = require("../models/product");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
/**
 * @param {productId} ID của sản phẩm
 * @param {name} Tên sản phẩm
 * @param {price} Giá sản phẩm
 * @param {quantity} Số lượng sản phẩm
 * @param {thumbnail} ��nh đại diện sản phẩm
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { productId, name, price, quantity, thumbnail } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], total: 0 });
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ
    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, thumbnail });
    }

    // Tính tổng tiền
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({ message: "Thêm sản phẩm vào giỏ hàng thành công", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Cập nhật số luong sp
/**
 * @param {productId} ID của sản phẩm
 * @param {quantity} Số lượng sản phẩm
 */
router.put("/update", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === productId
    );
    if (itemIndex === -1)
      return res
        .status(404)
        .json({ message: "Sản phẩm không tồn tại trong giỏ" });

    cart.items[itemIndex].quantity = quantity;
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Cập nhật số lượng thành công", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Xóa sản phẩm khỏi giỏ hàng
/**
 * @param {productId} ID của sản phẩm
 */
router.delete("/remove", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });
    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();
    res.json({ message: "Xóa sản phẩm khỏi giỏ hàng thành công", cart });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Xem giỏ hàng
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOne(req.userId);

    if (!cart)
      return res.json({
        message: "Giỏ hàng trống",
        cart: { items: [], total: 0 },
      });

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Tinh tong tien
router.get("/total", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });

    if (!cart)
      return res.status(404).json({ message: "Giỏ hàng không tồn tại" });

    const tax = cart.total * 0.1;
    const discount = cart.total > 1000000 ? 50000 : 0;
    const shippingFee = cart.total > 500000 ? 0 : 30000;

    const grandTotal = cart.total + tax - discount + shippingFee;

    res.json({ subtotal: cart.total, tax, discount, shippingFee, grandTotal });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
