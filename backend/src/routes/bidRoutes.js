const express = require('express');
const { body } = require('express-validator');
const {
  createBid,
  getBidsForGig,
  hireFreelancer
} = require('../controllers/bidController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Validation rules
const createBidValidation = [
  body('gigId')
    .notEmpty()
    .withMessage('Gig ID is required')
    .isMongoId()
    .withMessage('Invalid Gig ID'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters'),
  body('proposedPrice')
    .isNumeric()
    .withMessage('Proposed price must be a number')
    .custom((value) => value > 0)
    .withMessage('Proposed price must be greater than 0')
];

// Routes
router.post('/', protect, createBidValidation, validate, createBid);
router.get('/gig/:gigId', protect, getBidsForGig);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
