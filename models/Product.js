// server/models/Product.js
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a product name"],
    trim: true,
    maxlength: [100, "Name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a product description"],
    maxlength: [1000, "Description cannot be more than 1000 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please provide a product price"],
    min: [0, "Price must be a positive number"],
  },
  image: {
    type: String,
    required: [true, "Please provide a product image"],
  },
  category: {
    type: String,
    required: [true, "Please provide a product category"],
    enum: ["electronics", "clothing", "books", "home", "other"],
  },
  stock: {
    type: Number,
    required: [true, "Please provide stock quantity"],
    min: [0, "Stock cannot be negative"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index for search functionality
ProductSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", ProductSchema);
