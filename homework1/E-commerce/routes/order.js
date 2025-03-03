// const Order = require("./models/order");
// const express = require("express");
// const routes = express.Router();

// // Tạo đơn hàng mới

// exports.createOrder = async (req, res) => {
//   try {
//     const { user, items, total } = req.body;
//     const order = new Order({ user, items, total });
//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// module.exports = router;
