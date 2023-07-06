const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../midddleware/auth");

const router = express.Router();

router.route("/product").get(isAuthenticatedUser, getAllProducts);

router
  .route("/product/create")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(isAuthenticatedUser, getProduct);

module.exports = router;
