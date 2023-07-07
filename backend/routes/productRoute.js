const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  createAndUpdateProductReview,
} = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../midddleware/auth");

const router = express.Router();

// PRODUCT ROUTES: -

router.route("/product").get(isAuthenticatedUser, getAllProducts);

router
  .route("/admin/product/create")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct);

router
  .route("/admin/product/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

router.route("/product/:id").get(isAuthenticatedUser, getProduct);

router
  .route("/admin/createAndUpdateProductReview")
  .put(isAuthenticatedUser, createAndUpdateProductReview);

module.exports = router;
