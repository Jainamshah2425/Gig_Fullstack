const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Please provide a budget'],
    min: [0, 'Budget must be a positive number']
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned'],
    default: 'open',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Compound index for efficient queries
gigSchema.index({ status: 1, createdAt: -1 });

// Text index for search functionality
gigSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Gig', gigSchema);
