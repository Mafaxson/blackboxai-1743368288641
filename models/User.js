const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['public', 'household', 'industry', 'admin'],
    default: 'public'
  },
  organization: {
    type: String,
    required: function() {
      return this.role === 'industry';
    }
  },
  points: {
    type: Number,
    default: 0
  },
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method for login
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }
  return user;
};

module.exports = mongoose.model('User', userSchema);