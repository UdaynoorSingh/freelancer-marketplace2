const User = require('../models/User');
const Service = require('../models/Service');
const Review = require('../models/Review');

exports.addToFavorites = async (req, res) => {
    try {
        const { serviceId } = req.body;
        const user = await User.findById(req.user.id);

        if (!user.favorites.includes(serviceId)) {
            user.favorites.push(serviceId);
            await user.save();
        }

        res.json({ message: 'Added to favorites' });
    } catch (err) {
        res.status(500).json({ message: 'Error adding to favorites', error: err.message });
    }
};

exports.removeFromFavorites = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const user = await User.findById(req.user.id);

        user.favorites = user.favorites.filter(id => id.toString() !== serviceId);
        await user.save();

        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        res.status(500).json({ message: 'Error removing from favorites', error: err.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'favorites',
            populate: {
                path: 'seller',
                select: 'username email'
            }
        });
        const favoriteServices = user.favorites;

        // For each favorite service, fetch reviews and calculate avg rating/count
        const favoritesWithRatings = await Promise.all(favoriteServices.map(async (service) => {
            const reviews = await Review.find({ gigId: service._id });
            const reviewCount = reviews.length;
            const avgRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) : 0;
            return {
                ...service.toObject(),
                avgRating: avgRating.toFixed(1),
                reviewCount,
            };
        }));

        res.json(favoritesWithRatings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching favorites', error: err.message });
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const user = await User.findById(req.user.id);
        const isFavorite = user.favorites.includes(serviceId);
        res.json({ isFavorite });
    } catch (err) {
        res.status(500).json({ message: 'Error checking favorite status', error: err.message });
    }
}; 