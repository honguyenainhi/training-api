const express = require("express");
const Product = require("../models/product");

const router = express.Router();

// them san pham mới
/**
 * @param {name} Tên sản phẩm
 * @param {description} Mô tả sản phẩm
 * @param {sku} Mã SKU sản phẩm
 * @param {price} Giá sản phẩm
 * @param {quantity} Số lượng sản phẩm
 * @param {thumbnail} ��nh đại diện sản phẩm ��nh đại diện sản phẩm
 * @param {images} anh sản phẩm
 * @param {category} Loại sản phẩm
 */
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      price,
      quantity,
      thumbnail,
      images,
      category,
    } = req.body;

    // Kiểm tra sản phẩm đã tồn tại chưa
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res
        .status(400)
        .json({ message: "Sản phẩm đã tồn tại với mã SKU này." });
    }

    const newProduct = new Product({
      name,
      description,
      sku,
      price,
      quantity,
      thumbnail,
      images,
      category,
    });
    await newProduct.save();
    res.status(201).json({
      message: "Sản phẩm đã được thêm thành công",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

//Lấy danh sách sản phẩm
router.get("/get_list", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
