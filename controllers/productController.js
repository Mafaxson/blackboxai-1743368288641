const Product = require('../models/Product');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        $or: [
          { name: { $regex: req.query.keyword, $options: 'i' } },
          { description: { $regex: req.query.keyword, $options: 'i' } }
        ]
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    count
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, price, description, category, materialSource, images } = req.body;

  const product = new Product({
    name,
    price,
    description,
    category,
    materialSource,
    images,
    user: req.user.userId
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, category, materialSource, images, isFeatured } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.materialSource = materialSource || product.materialSource;
    product.images = images || product.images;
    product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user.userId.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      user: req.user.userId,
      name: req.user.email.split('@')[0],
      rating: Number(rating),
      comment
    };

    product.reviews.push(review);
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.getFeatured();
  res.json(products);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const products = await Product.getByCategory(req.params.category);
  res.json(products);
});