const WasteReport = require('../models/WasteReport');
const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');

// @desc    Create a waste report
// @route   POST /api/waste
// @access  Private
exports.createWasteReport = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { type, quantity, location, imageUrl, notes } = req.body;

  const report = new WasteReport({
    user: req.user.userId,
    type,
    quantity,
    location: {
      type: 'Point',
      coordinates: location.coordinates,
      address: location.address
    },
    ...(imageUrl && { imageUrl }),
    source: req.user.role === 'public' ? 'public' : req.user.role,
    notes
  });

  const createdReport = await report.save();

  // Update user points
  await User.findByIdAndUpdate(
    req.user.userId,
    { $inc: { points: createdReport.pointsAwarded } }
  );

  res.status(201).json(createdReport);
});

// @desc    Get all waste reports for user
// @route   GET /api/waste
// @access  Private
exports.getUserWasteReports = asyncHandler(async (req, res) => {
  const reports = await WasteReport.find({ user: req.user.userId })
    .sort('-createdAt')
    .limit(20);

  res.json(reports);
});

// @desc    Get nearby waste reports
// @route   GET /api/waste/nearby
// @access  Private
exports.getNearbyWasteReports = asyncHandler(async (req, res) => {
  const { lat, lng, maxDistance = 5000 } = req.query;
  
  if (!lat || !lng) {
    res.status(400);
    throw new Error('Please provide latitude and longitude');
  }

  const reports = await WasteReport.findNearby(
    [parseFloat(lng), parseFloat(lat)],
    parseInt(maxDistance)
  );

  res.json(reports);
});

// @desc    Update waste report status (Admin only)
// @route   PUT /api/waste/:id/status
// @access  Private/Admin
exports.updateReportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const report = await WasteReport.findById(req.params.id);
  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  report.status = status;
  if (status === 'collected') {
    report.collectionDate = new Date();
  } else if (status === 'processed') {
    report.processedDate = new Date();
  }

  const updatedReport = await report.save();
  res.json(updatedReport);
});