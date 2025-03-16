const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const mongoose = require("mongoose");

// Create a payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No items in cart",
      });
    }

    // Calculate the order amount
    let totalAmount = 0;
    for (const item of cartItems) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product with ID ${item.product._id} not found`,
        });
      }

      // Validate stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Not enough stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      totalAmount += product.price * item.quantity;
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Stripe expects amount in cents
      currency: "usd",
      metadata: {
        userId: req.user.id,
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({
      success: false,
      error: "Server error while creating payment intent",
    });
  }
};

// server/controllers/stripeController.js
exports.createOrder = async (req, res) => {
  try {
    const { paymentIntentId, cartItems, shippingAddress } = req.body;

    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      throw new Error("Payment not successful");
    }

    // Calculate totals
    let itemsPrice = 0;
    const orderItems = [];

    // Process each cart item without transactions
    for (const item of cartItems) {
      // Find product and check stock
      const product = await Product.findById(item.product._id);

      if (!product) {
        throw new Error(`Product not found with id of ${item.product._id}`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Product "${product.name}" is out of stock`);
      }

      // Decrease stock
      product.stock -= item.quantity;
      await product.save();

      // Add to order items
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        image: product.image,
      });

      itemsPrice += product.price * item.quantity;
    }

    // Create order (no transaction)
    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod: "Stripe",
      paymentResult: {
        id: paymentIntentId,
        status: "completed",
        update_time: Date.now(),
        email_address: req.user.email,
      },
      itemsPrice,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: itemsPrice,
      isPaid: true,
      paidAt: Date.now(),
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
