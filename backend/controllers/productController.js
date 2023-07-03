const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../midddleware/catchAysncHandler");
const ApiFeatures = require("../utils/apiFeatures");

/**
 * create a product
 */

exports.createProduct = catchAsyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    message: "product uploaded successfully...",
    data: product,
  });
});

/**
 * get All Products
 */

exports.getAllProducts = catchAsyncHandler(async (req, res, next) => {
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();
  // const products = await Product.find();
  const products = await apiFeature.query;
  if (!products) {
    return next(new ErrorHandler("Product not found", 400));
    // res.status(500).json({
    //   success: false,
    //   message: "Product not found",
    // });
  }
  res.status(200).json({
    success: true,
    message: "fetched all data..",
    data: products,
  });
});

/**
 * get single product by id
 */

exports.getProduct = catchAsyncHandler(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("Product Not found", 400));
    // res.status(500).json({
    //   success: false,
    //   message: "Product not Found",
    // });
  }
  res.status(200).json({
    success: true,
    message: "fetched a product.",
    data: products,
  });
});

/**
 * update product by id
 * @param Admin can only access
 */

exports.updateProduct = catchAsyncHandler(async (req, res, next) => {
  let products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("Product not found", 400));
    // return res.status(500).json({
    //   success: false,
    //   message: "No products found",
    // });
  }
  products = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "updated successfully...",
    data: products,
  });
});

/**
 * Delete a product
 * @param Admin can only delete
 */

exports.deleteProduct = catchAsyncHandler(async (req, res, next) => {
  const products = await Product.deleteOne({ _id: req.params.id });
  if (!products) {
    return next(new ErrorHandler("Product not found ", 400));
    // return res.status(500).json({
    //   success: false,
    //   message: "Not found",
    // });
  }
  res.status(200).json({
    success: true,
    message: "product deleted successfully...",
    data: products,
  });
});
