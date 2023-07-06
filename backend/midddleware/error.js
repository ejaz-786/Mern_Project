const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Interanl Server Error";

  // wrong mongoDB ID error(like smallest , largest)

  if (err.name === "CastError") {
    const message = `Resource not Found invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate MongoDB key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered.`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json WebToken is not valid , try again.`;
    err = new ErrorHandler(message, 400);
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    const message = `Json WebToken has been expire , please try again..`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // error: err.message,
    // err: err.stack,
  });
};
