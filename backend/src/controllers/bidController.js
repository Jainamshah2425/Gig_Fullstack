const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');
const ApiError = require('../utils/apiError');

// @desc    Submit a bid on a gig
// @route   POST /api/bids
// @access  Private
exports.createBid = async (req, res, next) => {
  try {
    const { gigId, message, proposedPrice } = req.body;

    // Validate input
    if (!gigId || !message || !proposedPrice) {
      return res.status(400).json({ 
        error: 'Please provide gigId, message, and proposedPrice' 
      });
    }

    if (proposedPrice <= 0) {
      return res.status(400).json({ 
        error: 'Proposed price must be greater than 0' 
      });
    }

    // Check if gig exists and is still open
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    if (gig.status !== 'open') {
      return res.status(400).json({ error: 'Gig is no longer open for bidding' });
    }

    // Check if user is not the gig owner
    if (gig.ownerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'You cannot bid on your own gig' });
    }

    // Check if user has already bid (unique constraint will also catch this)
    const existingBid = await Bid.findOne({ 
      gigId, 
      freelancerId: req.user._id 
    });

    if (existingBid) {
      return res.status(400).json({ error: 'You have already submitted a bid for this gig' });
    }

    // Create bid
    const bid = await Bid.create({
      gigId,
      freelancerId: req.user._id,
      message,
      proposedPrice
    });

    res.status(201).json({ bid });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bids for a specific gig
// @route   GET /api/bids/gig/:gigId
// @access  Private (gig owner only)
exports.getBidsForGig = async (req, res, next) => {
  try {
    const { gigId } = req.params;

    // Find gig and check ownership
    const gig = await Gig.findById(gigId);

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Check if user is the gig owner
    if (gig.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ 
        error: 'Forbidden: Only gig owner can view bids' 
      });
    }

    // Find all bids for this gig
    const bids = await Bid.find({ gigId })
      .populate('freelancerId', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ bids });
  } catch (error) {
    next(error);
  }
};

// @desc    Hire a freelancer (atomic operation with MongoDB transactions)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (gig owner only)
exports.hireFreelancer = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bidId } = req.params;

    // Step 1: Find the bid and populate gigId
    const bid = await Bid.findById(bidId)
      .populate('gigId')
      .session(session);

    if (!bid) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Step 2: Authorization check
    if (bid.gigId.ownerId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(403).json({ 
        error: 'Forbidden: Only gig owner can hire' 
      });
    }

    // Step 3: Check if gig is still open (CRITICAL)
    if (bid.gigId.status !== 'open') {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: 'Gig is already assigned' });
    }

    // Step 4: Update gig status to 'assigned' (ATOMIC)
    const updatedGig = await Gig.findOneAndUpdate(
      { _id: bid.gigId._id, status: 'open' }, // Double-check status
      { status: 'assigned' },
      { new: true, session }
    );

    if (!updatedGig) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ 
        error: 'Gig was already assigned by another process' 
      });
    }

    // Step 5: Update the hired bid
    await Bid.findByIdAndUpdate(
      bidId,
      { status: 'hired' },
      { session }
    );

    // Step 6: Reject all other bids for this gig (BULK UPDATE)
    await Bid.updateMany(
      { gigId: bid.gigId._id, _id: { $ne: bidId } },
      { status: 'rejected' },
      { session }
    );

    // Step 7: Commit transaction
    await session.commitTransaction();
    session.endSession();

    // Step 8: Get updated bid with populated fields
    const updatedBid = await Bid.findById(bidId)
      .populate('freelancerId', 'name email')
      .populate('gigId');

    // Step 9: BONUS - Emit Socket.io event for real-time notification
    if (req.app.get('io')) {
      const io = req.app.get('io');
      io.to(bid.freelancerId.toString()).emit('hired', {
        message: `You have been hired for "${bid.gigId.title}"!`,
        gigId: bid.gigId._id,
        bidId: bid._id
      });
    }

    res.status(200).json({
      message: 'Freelancer hired successfully',
      bid: updatedBid,
      gig: updatedGig
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
