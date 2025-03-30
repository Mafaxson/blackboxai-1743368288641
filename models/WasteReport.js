const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.source !== 'public';
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['plastic', 'organic', 'metal', 'paper', 'glass', 'hazardous', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  location: {
    type: {
      type: String,
      default: 'Point',
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      required: true
    },
    address: {
      type: String,
      required: function() {
        return this.source === 'public';
      }
    }
  },
  imageUrl: String,
  source: {
    type: String,
    required: true,
    enum: ['public', 'household', 'industry'],
    default: 'public'
  },
  status: {
    type: String,
    enum: ['reported', 'scheduled', 'collected', 'processed'],
    default: 'reported'
  },
  detectionConfidence: Number,
  notes: String,
  collectionDate: Date,
  processedDate: Date,
  pointsAwarded: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

wasteReportSchema.index({ location: '2dsphere' });

wasteReportSchema.statics.findNearby = function(coordinates, maxDistance = 5000) {
  return this.find({
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: maxDistance
      }
    }
  });
};

wasteReportSchema.pre('save', function(next) {
  if (this.isNew) {
    const pointsMap = {
      plastic: 5,
      organic: 3,
      metal: 7,
      paper: 2,
      glass: 4,
      hazardous: 10,
      other: 1
    };
    this.pointsAwarded = pointsMap[this.type] * this.quantity;
    
    // Auto-detect date/time for public reports
    if (this.source === 'public') {
      this.createdAt = new Date();
    }
  }
  next();
});

module.exports = mongoose.model('WasteReport', wasteReportSchema);