const { body, param } = require('express-validator');

exports.productValidator = [
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be less than 100 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
    
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
    
  body('category')
    .isIn(['building-materials', 'energy', 'furniture', 'art', 'other'])
    .withMessage('Invalid category'),
    
  body('materialSource')
    .isIn(['plastic', 'organic', 'metal', 'paper', 'glass', 'composite'])
    .withMessage('Invalid material source'),
    
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Image URL must be valid'),
    
  body('images.*.altText')
    .optional()
    .isString()
    .withMessage('Alt text must be a string')
];

exports.reviewValidator = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
    
  body('comment')
    .optional()
    .isString()
    .withMessage('Comment must be a string')
];

exports.categoryValidator = [
  param('category')
    .isIn(['building-materials', 'energy', 'furniture', 'art', 'other'])
    .withMessage('Invalid category')
];