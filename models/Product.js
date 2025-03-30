const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['building-materials', 'energy', 'furniture', 'art', 'other']
  },
  materialSource: {
    type: String,
    required: true,
    enum: ['plastic', 'organic', 'metal', 'paper', 'glass', 'composite']
  },
  images: [{
    url: String,
    altText: String
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Virtual for average rating
productSchema.virtual('averageRating').get(function() {
  if (this.reviews.length === 0) return 0;
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / this.reviews.length;
});

// Static method to get featured products
productSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ isFeatured: true })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static method to get products by category
productSchema.statics.getByCategory = function(category, limit = 10) {
  return this.find({ category })
    .limit(limit)
    .sort({ createdAt: -1 });
};

module.exports = mongoose.model('Product', productSchema);