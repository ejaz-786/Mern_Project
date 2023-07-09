const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const catchAysncHandler = require("../midddleware/catchAysncHandler");
const ErrorHandler = require("../utils/errorHandler");

// 1. CREATE AN ORDER :-
exports.createOrder = catchAysncHandler(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
  } = req.body;

  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    shippingPrice,
    paidAt: Date.now(),
    user_id: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: `Order created successfully...`,
    order,
  });
});

// 2. GET SINGLE ORDER :-

exports.getSingleOrder = catchAysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id).populate("user_id", "name email");

  if (!order) {
    return next(new ErrorHandler(`Order doesnt exist `, 400));
  }

  res.status(200).json({
    success: true,
    message: `fetched order successfully...`,
    order,
  });
});

// 3. GET LOGGED IN USER ORDER:-

exports.myOrders = catchAysncHandler(async (req, res, next) => {
  const orders = await Order.find({ user_id: req.user._id });
  if (!orders) {
    return next(new ErrorHandler(`Order doesnt exist `, 400));
  }
  res.status(200).json({
    success: true,
    message: `fetched all my orders successfully...`,
    orders,
  });
});

// 4. GET ALL ORDERS ---- ADMIN
exports.getAllOrders = catchAysncHandler(async (req, res, next) => {
  const orders = await Order.find();
  if (!orders) {
    return next(new ErrorHandler(`Order not found`, 400));
  }
  // total amount of orders:-
  const totalAmount = orders.reduce(
    (acc, order) => (acc += order.totalPrice),
    0
  );
  res.status(200).json({
    success: true,
    message: "fetched all orders successfullly...",
    orders,
    totalAmount,
  });
});

// 5. UPDATE ORDER --ADMIN
exports.updateOrder = catchAysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler(`Order not found with this id:${id}`));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler(`You have already delivered this order`, 400));
  }

  // update the product stock if the order has been develiverd

  order.orderItems.forEach(async (ord) => {
    await updateStock(ord.product_id, ord.quantity);
  });
  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliverAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    message: `Order has been updated successfully...`,
    order,
  });
});

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
};

// 5. DELETE ORDER --ADMIN
exports.deleteOrder = catchAysncHandler(async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new ErrorHandler(`order not found with this id:${id}`));
  }

  const deletedOrder = await order.deleteOne({ _id: id });

  res.status(200).json({
    success: true,
    message: `Order has been deleted successfully...`,
    deletedOrder,
  });
});
