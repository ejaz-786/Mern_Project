const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../midddleware/catchAysncHandler");
const ApiFeatures = require("../utils/apiFeatures");

/** 1.
 * create a product
 * @param Admin can only access
 */

exports.createProduct = catchAsyncHandler(async (req, res, next) => {
  req.body.user_id = req.user._id;
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    message: "product uploaded successfully...",
    data: product,
  });
});

/** 2.
 * get All Products
 */

exports.getAllProducts = catchAsyncHandler(async (req, res, next) => {
  const resultPerPage = 5;
  const totalCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultPerPage);
  // const products = await Product.find();
  const products = await apiFeature.query;
  if (!products) {
    return next(new ErrorHandler("Product not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "fetched all data..",
    totalCount,
    currentCount: products.length,
    data: products,
  });
});

/** 3.
 * get single product by id
 */

exports.getProduct = catchAsyncHandler(async (req, res, next) => {
  const products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("Product Not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "fetched a product.",
    data: products,
  });
});

/** 4.
 * update product by id
 * @param Admin can only access
 */

exports.updateProduct = catchAsyncHandler(async (req, res, next) => {
  let products = await Product.findById(req.params.id);
  if (!products) {
    return next(new ErrorHandler("Product not found", 400));
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

/**  5.
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

// REVIEWS / RATINGS :-

exports.createAndUpdateProductReview = catchAsyncHandler(
  async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
      user_id: req.user.id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    };
    const product = await Product.findById(productId);

    if (!product) {
      return next(new ErrorHandler(`Product not Found `, 400));
    }

    const isReviewed = product.reviews.some(
      (element) => element.user_id.toString() === review.user_id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((element) => {
        if (element.user_id.toString() === review.user_id)
          (element.rating = rating), (element.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.noOfReviews = product.reviews.length;
    }
    product.ratings =
      product.reviews.reduce((acc, ele) => (acc += ele.rating), 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `${
        isReviewed
          ? "Product Edited Successfully.."
          : "Product created Successfully.."
      }`,
      product,
    });
  }
);
