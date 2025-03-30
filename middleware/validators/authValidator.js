const { body } = require('express-validator');
const User = require('../../models/User');

exports.registerValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error('Email already in use');
      }
    }),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .trim(),
    
  body('role')
    .isIn(['public', 'household', 'industry', 'admin'])
    .withMessage('Invalid user role'),
    
  body('organization')
    .if(body('role').equals('industry'))
    .notEmpty()
    .withMessage('Organization is required for industry users')
    .trim(),
    
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number')
];

exports.loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .trim()
];

exports.profileValidator = [
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
    
  body('address.street')
    .optional()
    .trim(),
    
  body('address.city')
    .optional()
    .trim(),
    
  body('address.state')
    .optional()
    .trim(),
    
  body('address.zipCode')
    .optional()
    .isPostalCode('any')
    .withMessage('Please enter a valid postal code')
];