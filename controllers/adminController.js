const User = require('../models/User');
const WasteReport = require('../models/WasteReport');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Get system analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  const [usersCount, reportsCount, productsCount] = await Promise.all([
    User.countDocuments(),
    WasteReport.countDocuments(),
    Product.countDocuments()
  ]);

  const recentReports = await WasteReport.find()
    .sort('-createdAt')
    .limit(5)
    .populate('user', 'email role');

  const recentProducts = await Product.find()
    .sort('-createdAt')
    .limit(5);

  res.json({
    counts: {
      users: usersCount,
      wasteReports: reportsCount,
      products: productsCount
    },
    recentReports,
    recentProducts
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
    .select('-password')
    .sort('-createdAt');

  res.json(users);
});

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.role = role;
  await user.save();

  res.json({
    _id: user._id,
    email: user.email,
    role: user.role
  });
});

// @desc    Get all waste reports
// @route   GET /api/admin/waste-reports
// @access  Private/Admin
exports.getAllWasteReports = asyncHandler(async (req, res) => {
  const reports = await WasteReport.find({})
    .populate('user', 'email role')
    .sort('-createdAt');

  res.json(reports);
});

// @desc    Update reward points for user
// @route   PUT /api/admin/users/:id/points
// @access  Private/Admin
exports.updateUserPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.points = points;
  await user.save();

  res.json({
    _id: user._id,
    email: user.email,
    points: user.points
  });
});