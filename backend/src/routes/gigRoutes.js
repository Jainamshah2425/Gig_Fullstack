const express = require('express');
const { body } = require('express-validator');
const {
  getAllGigs,
  getGigById,
  createGig,
  getMyGigs
} = require('../controllers/gigController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validator');

const router = express.Router();

// Validation rules
const createGigValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('budget')
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom((value) => value > 0)
    .withMessage('Budget must be greater than 0')
];

// Routes
router.get('/', getAllGigs);
router.get('/my-gigs', protect, getMyGigs);
router.get('/:id', getGigById);
router.post('/', protect, createGigValidation, validate, createGig);

module.exports = router;
