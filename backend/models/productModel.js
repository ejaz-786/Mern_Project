const mongoose = require("mongoose");
// const autoincreament = require("mongoose-auto-increment");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product name"],
  },
  description: {
    type: String,
    required: [true, "Please Enter product description"],
  },
  price: {
    type: String,
    required: [true, "Please Enter  product Price"],
    maxLength: [8, "Price can not be exceeded more than 8 char"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please Enter product category"],
  },
  Stock: {
    type: Number,
    required: [true, "Please Enter product stock"],
    default: 0,
    maxLength: [4, "Stock can not be exceded more that 4 char"],
  },
  noOfReviews: {
    type: Number,
    required: [true, "Please Enter product's Review"],
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// autoincreament.initialize(mongoose.connection);
// productSchema.plugin(autoincreament.plugin, "Product");

module.exports = mongoose.model("Product", productSchema);
