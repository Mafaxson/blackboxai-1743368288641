const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const productValidator = require('../middleware/validators/productValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(productController.getProducts)
  .post(
    protect,
    authorize('admin'),
    productValidator.productValidator,
    productController.createProduct
  );

router.route('/featured')
  .get(productController.getFeaturedProducts);

router.route('/category/:category')
  .get(
    productValidator.categoryValidator,
    productController.getProductsByCategory
  );

router.route('/:id')
  .get(productController.getProductById)
  .put(
    protect,
    authorize('admin'),
    productValidator.productValidator,
    productController.updateProduct
  )
  .delete(
    protect,
    authorize('admin'),
    productController.deleteProduct
  );

router.route('/:id/reviews')
  .post(
    protect,
    productValidator.reviewValidator,
    productController.createProductReview
  );

module.exports = router;