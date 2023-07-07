const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateUserProfile,
  getAllUser,
  getSingleUser,
  updateSelfRole,
  updateOtherRoles,
  deleteUser,
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../midddleware/auth");

const router = express.Router();

// Authentication Routes: -

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/logout").get(logoutUser);

router.route("/getUserDetails").get(isAuthenticatedUser, getUserDetails);

router.route("/updateUserPassword").put(isAuthenticatedUser, updatePassword);

router.route("/selfUpdateProfile").put(isAuthenticatedUser, updateUserProfile);

router
  .route("/admin/getAllUser")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/getSingleUser/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

router
  .route("/admin/updateSelfRole")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateSelfRole);

router
  .route("/admin/updateOtherRole/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOtherRoles);

router
  .route("/admin/deleteUser/:id")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

module.exports = router;
