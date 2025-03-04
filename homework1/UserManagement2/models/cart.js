const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        quantity: Number,
        thumbnail: String,
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0.1, // 10% VAT
    },
    discount: {
      type: Number,
      default: 0,
    },
    shippingFee: {
      type: Number,
      default: 5,
    },
    grandTotal: {
      type: Number,
      default: null,
    },
    shippingAddress: {
      fullName: { type: String, default: null },
      address: { type: String, default: null },
      city: { type: String, default: null },
      postalCode: { type: String, default: null },
      country: { type: String, default: null },
      phone: { type: String, default: null },
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "paypal", "credit_card", "bank_transfer"],
      required: true,
    },
    transactionId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
