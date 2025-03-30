const { body, query } = require('express-validator');

exports.createWasteReportValidator = [
  body('type')
    .isIn(['plastic', 'organic', 'metal', 'paper', 'glass', 'hazardous', 'other'])
    .withMessage('Invalid waste type'),
  
  body('quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
    
  body('location.coordinates')
    .isArray({ min: 2, max: 2 })
    .withMessage('Coordinates must be an array of [longitude, latitude]'),
    
  body('location.coordinates.*')
    .isFloat()
    .withMessage('Coordinates must be numbers'),
    
  body('location.address')
    .optional()
    .isString()
    .withMessage('Address must be a string'),
    
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
    
  body('notes')
    .optional()
    .isString()
    .withMessage('Notes must be a string')
];

exports.nearbyWasteValidator = [
  query('lat')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
    
  query('lng')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
    
  query('maxDistance')
    .optional()
    .isInt({ min: 100, max: 10000 })
    .withMessage('Max distance must be between 100 and 10000 meters')
];

exports.updateStatusValidator = [
  body('status')
    .isIn(['reported', 'scheduled', 'collected', 'processed'])
    .withMessage('Invalid status')
];