const Gig = require('../models/Gig');
const ApiError = require('../utils/apiError');

// @desc    Get all open gigs with optional search
// @route   GET /api/gigs
// @access  Public
exports.getAllGigs = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;

    // Build query
    const query = { status: 'open' };

    // Add text search if search param exists
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const gigs = await Gig.find(query)
      .populate('ownerId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Get total count for pagination metadata
    const total = await Gig.countDocuments(query);

    res.status(200).json({
      gigs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gig by ID
// @route   GET /api/gigs/:id
// @access  Public
exports.getGigById = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id)
      .populate('ownerId', 'name email');

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    res.status(200).json({ gig });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gig
// @route   POST /api/gigs
// @access  Private
exports.createGig = async (req, res, next) => {
  try {
    const { title, description, budget } = req.body;

    // Validate input
    if (!title || !description || !budget) {
      return res.status(400).json({ 
        error: 'Please provide title, description, and budget' 
      });
    }

    if (budget <= 0) {
      return res.status(400).json({ 
        error: 'Budget must be greater than 0' 
      });
    }

    // Create gig
    const gig = await Gig.create({
      title,
      description,
      budget,
      ownerId: req.user._id
    });

    res.status(201).json({ gig });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all gigs created by current user
// @route   GET /api/gigs/my-gigs
// @access  Private
exports.getMyGigs = async (req, res, next) => {
  try {
    const gigs = await Gig.find({ ownerId: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({ gigs });
  } catch (error) {
    next(error);
  }
};
