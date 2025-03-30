const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authValidator = require('../middleware/validators/authValidator');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  authValidator.registerValidator,
  authController.register
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/login',
  authValidator.loginValidator,
  authController.login
);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get(
  '/profile',
  protect,
  authController.getProfile
);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put(
  '/profile',
  protect,
  authValidator.profileValidator,
  authController.updateProfile
);

module.exports = router;