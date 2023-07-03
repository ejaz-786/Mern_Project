const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/product").get(getAllProducts);
router.route("/product/create").post(createProduct);
router.route("/product/:id").put(updateProduct);
router.route("/product/:id").delete(deleteProduct);
router.route("/product/:id").get(getProduct);

module.exports = router;
