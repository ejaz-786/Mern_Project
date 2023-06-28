const Product = require("../models/productModel");

/**
 * create a product
 */

exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(200).json({
    success: true,
    message: "product uploaded successfully...",
    data: product,
  });
};

/**
 * get All Products
 */

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    message: "fetched all data..",
    data: products,
  });
};

/**
 * get Product by id
 * @param Admin can only access
 */

exports.updateProduct = async (req, res, next) => {
  let products = await Product.findById(req.params.id);
  if (!products) {
    return res.status(500).json({
      success: false,
      message: "No products found",
    });
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
};

/**
 * Delete a product
 * @param Admin can only delete
 */

exports.deleteProduct = async (req, res, next) => {
  let products = Product.findById(req.params.id);

  if (!products) {
    return res.status(500).json({
      success: false,
      message: "No products found...",
    });
  }

  // Product.remove({ _id: mongodb.ObjectID(req.params.id) });
  await products.findOneAndRemove({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted successfully....",
    data: products,
  });
};
