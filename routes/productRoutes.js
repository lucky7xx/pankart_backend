const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductsBatch,
} = require("../server/controllers/productController");

const { protect, authorize } = require("../server/middleware/auth");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(protect, authorize("admin"), createProduct);

router.post("/batch", protect, authorize("admin"), createProductsBatch);

router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("admin"), updateProduct)
  .delete(protect, authorize("admin"), deleteProduct);
router.post("/batch", protect, authorize("admin"), createProductsBatch);

module.exports = router;
