const mongoose = require('mongoose');

const apiAgentSchema = new mongoose.Schema({
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
  apiConfig: {
    provider: {
      type: String,
      required: true
    },
    endpoint: {
      type: String,
      required: true
    },
    authType: {
      type: String,
      enum: ['apiKey', 'oauth', 'custom'],
      required: true
    },
    requiredScopes: [String],
    rateLimit: {
      requests: Number,
      period: String
    },
    pricing: {
      model: String,
      costPerToken: Number,
      maxTokens: Number
    }
  },
  integration: {
    documentation: String,
    exampleCode: String,
    supportedLanguages: [String]
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
apiAgentSchema.pre('save', function(next) {
  if (this.reviews.length > 0) {
    this.rating = this.reviews.reduce((acc, review) => acc + review.rating, 0) / this.reviews.length;
    this.reviewCount = this.reviews.length;
  }
  next();
});

const APIAgent = mongoose.model('APIAgent', apiAgentSchema);

module.exports = APIAgent; 