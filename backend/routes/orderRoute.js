const express = require("express");
const {
  createOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../midddleware/auth");

const router = express.Router();

router.route("/order/create").post(isAuthenticatedUser, createOrder);

router.route("/singleOrder/:id").get(isAuthenticatedUser, getSingleOrder);

router.route("/myOrders").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/getAllorders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

router
  .route("/admin/updateOrder/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder);

router
  .route("/admin/deleteOrder/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
