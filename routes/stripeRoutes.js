// server/routes/stripeRoutes.js
const express = require("express");
const {
  createPaymentIntent,
  createOrder,
} = require("../server/controllers/stripeController");
const { protect } = require("../server/middleware/auth");

const router = express.Router();

router.post("/create-payment-intent", protect, createPaymentIntent);
router.post("/create-order", protect, createOrder);

module.exports = router;
