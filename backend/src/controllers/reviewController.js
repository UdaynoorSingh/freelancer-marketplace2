// controllers/reviewController.js
const Review = require('../models/Review');
const Order = require('../models/Order');

exports.addReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const gigId = req.params.gigId;
        // Check if user has completed an order for this gig
        const hasOrder = await Order.findOne({ gigId, buyerId: req.user.id, status: 'completed' });
        if (!hasOrder) return res.status(403).json({ message: 'You can only review gigs you have completed an order for.' });
        // Check if user already reviewed
        const already = await Review.findOne({ gigId, userId: req.user.id });
        if (already) return res.status(400).json({ message: 'You have already reviewed this gig.' });
        const review = new Review({ rating, comment, userId: req.user.id, gigId });
        await review.save();
        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: 'Error adding review', error: err.message });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const gigId = req.params.gigId;
        const reviews = await Review.find({ gigId }).populate('userId', 'username');
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews', error: err.message });
    }
}; 

exports.averagerating = async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const reviews = await Review.find({ gigId });

    if (reviews.length === 0) {
      return res.json({ averageRating: 0 });
    }

    const avg =reviews.reduce((sum, review) => sum+review.rating,0) / reviews.length;

    res.json({ averageRating: Number(avg.toFixed(1)) });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating average rating', error: err.message });
  }
};
