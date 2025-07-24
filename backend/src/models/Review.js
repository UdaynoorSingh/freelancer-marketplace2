// src/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema); 