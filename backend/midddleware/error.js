const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Interanl Server Error";

  // wrong mongoDB ID error(like smallest , largest)

  if (err.name === "CastError") {
    const message = `Resource not Found invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    // error: err.message,
    // err: err.stack,
  });
};
