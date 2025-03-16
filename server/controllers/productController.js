const Product = require("../../models/Product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["select", "sort", "page", "limit", "search"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Finding resource
    let query = Product.find(JSON.parse(queryStr));

    // Search functionality
    if (req.query.search) {
      query = query.find({ $text: { $search: req.query.search } });
    }

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments(JSON.parse(queryStr));

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const products = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product not found with id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product not found with id of ${req.params.id}`,
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: `Product not found with id of ${req.params.id}`,
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// @desc    Create multiple products
// @route   POST /api/products/batch
// @access  Private/Admin
// Enhanced batch creation method
exports.createProductsBatch = async (req, res) => {
  try {
    console.log("Received batch creation request", req.body);
    const products = req.body;

    // Validate input
    if (!Array.isArray(products)) {
      return res.status(400).json({
        success: false,
        error: "Request body must be an array of products",
      });
    }

    // Validate each product before batch insert
    const validationErrors = products
      .map((product, index) => {
        try {
          const validatedProduct = new Product(product);
          validatedProduct.validateSync();
          return null;
        } catch (validationError) {
          return {
            index,
            errors: validationError.errors,
          };
        }
      })
      .filter((error) => error !== null);

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Validation failed for some products",
        validationErrors,
      });
    }

    // Perform batch insert
    const createdProducts = await Product.insertMany(products, {
      ordered: false, // Continue inserting even if some documents fail
    });

    res.status(201).json({
      success: true,
      count: createdProducts.length,
      data: createdProducts,
    });
  } catch (error) {
    console.error("Error creating products batch:", error);
    res.status(400).json({
      success: false,
      error: error.message,
      ...(error.errors && { validationErrors: error.errors }),
    });
  }
};
