const express = require('express');
const router = express.Router();
const wasteController = require('../controllers/wasteController');
const wasteValidator = require('../middleware/validators/wasteValidator');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(
    protect,
    wasteValidator.createWasteReportValidator,
    wasteController.createWasteReport
  )
  .get(
    protect,
    wasteController.getUserWasteReports
  );

router.route('/nearby')
  .get(
    protect,
    wasteValidator.nearbyWasteValidator,
    wasteController.getNearbyWasteReports
  );

router.route('/:id/status')
  .put(
    protect,
    authorize('admin'),
    wasteValidator.updateStatusValidator,
    wasteController.updateReportStatus
  );

module.exports = router;