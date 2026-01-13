const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true,
    index: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please provide a message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  proposedPrice: {
    type: Number,
    required: [true, 'Please provide a proposed price'],
    min: [0, 'Price must be a positive number']
  },
  status: {
    type: String,
    enum: ['pending', 'hired', 'rejected'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
bidSchema.index({ gigId: 1, status: 1 });

// Prevent duplicate bids from same freelancer on same gig
bidSchema.index({ gigId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Bid', bidSchema);
