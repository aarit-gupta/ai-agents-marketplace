const mongoose = require('mongoose');

const appAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  version: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  isFree: {
    type: Boolean,
    default: false
  },
  developer: {
    type: String,
    required: true
  },
  publisher: {
    type: String,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  categories: [{
    type: String,
    required: true
  }],
  tags: [{
    type: String
  }],
  media: {
    screenshots: [String],
    videos: [String],
    icon: String,
    banner: String
  },
  features: [String],
  appConfig: {
    size: {
      type: Number,
      required: true
    },
    requirements: {
      os: [String],
      nodeVersion: String,
      pythonVersion: String,
      memory: Number,
      disk: Number,
      gpu: String
    },
    dependencies: [{
      name: String,
      version: String,
      type: {
        type: String,
        enum: ['runtime', 'dev', 'optional']
      }
    }],
    installScript: String,
    uninstallScript: String,
    launchCommand: String
  },
  updates: {
    autoUpdate: {
      type: Boolean,
      default: true
    },
    updateChannel: {
      type: String,
      enum: ['stable', 'beta', 'alpha'],
      default: 'stable'
    },
    lastChecked: Date
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: String,
    date: {
      type: Date,
      default: Date.now
    },
    helpful: {
      type: Number,
      default: 0
    }
  }]
}, {
  timestamps: true
});

// Update rating when reviews change
appAgentSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

const AppAgent = mongoose.model('AppAgent', appAgentSchema);

module.exports = AppAgent; 