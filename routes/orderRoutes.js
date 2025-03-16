const express = require("express");
const { getMyOrders } = require("../server/controllers/orderController");

const { protect, authorize } = require("../server/middleware/auth");

const router = express.Router();

router.route("/myorders").get(protect, getMyOrders);

module.exports = router;
