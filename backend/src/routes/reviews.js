// src/routes/reviews.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middlewares/auth');

router.post('/:gigId', auth, reviewController.addReview);
router.get('/:gigId', reviewController.getReviews);
router.get('/average-rating/:gigId', reviewController.averagerating);

module.exports = router; 