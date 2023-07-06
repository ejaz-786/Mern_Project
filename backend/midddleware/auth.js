const ErrorHandler = require("../utils/errorHandler");
const catchAysncHandler = require("./catchAysncHandler");
const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

exports.isAuthenticatedUser = catchAysncHandler(async (req, res, next) => {
  // const { tokens } = req.cookies;
  let token = req.headers.authorization;
  token = token.replace(/^Bearer\s+/i, "");

  if (!token) {
    return next(new ErrorHandler("Please Login to access this resource", 401));
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodeData) => {
    if (err) {
      return next(new ErrorHandler(err, 500));
    } else {
      req.user = await User.findById(decodeData.user_id);
      next();
    }
  });
});

exports.authorizeRoles = (...roles) => {
  return catchAysncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `Role: ${req.user.role} is not allowed to access this resource `,
          403
        )
      );
    }
    next();
  });
};
