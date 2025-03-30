const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Analytics routes
router.route('/analytics')
  .get(
    protect,
    authorize('admin'),
    adminController.getAnalytics
  );

// User management routes
router.route('/users')
  .get(
    protect,
    authorize('admin'),
    adminController.getUsers
  );

router.route('/users/:id/role')
  .put(
    protect,
    authorize('admin'),
    adminController.updateUserRole
  );

router.route('/users/:id/points')
  .put(
    protect,
    authorize('admin'),
    adminController.updateUserPoints
  );

// Waste report management
router.route('/waste-reports')
  .get(
    protect,
    authorize('admin'),
    adminController.getAllWasteReports
  );

module.exports = router;