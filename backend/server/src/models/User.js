const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String
  },
  library: [{
    agentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'library.agentType'
    },
    agentType: {
      type: String,
      enum: ['APIAgent', 'AppAgent']
    },
    installPath: String,
    installedAt: Date,
    lastUsed: Date,
    status: {
      type: String,
      enum: ['active', 'inactive', 'error'],
      default: 'active'
    },
    config: {
      apiKey: String,
      endpoint: String,
      customSettings: mongoose.Schema.Types.Mixed
    }
  }],
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'wishlist.agentType'
  }],
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 