const express = require('express');
const router = express.Router();
const { addToFavorites, removeFromFavorites, getFavorites, checkFavorite } = require('../controllers/favoritesController');
const auth = require('../middlewares/auth');

// All routes require authentication
router.use(auth);

// Add service to favorites
router.post('/add', addToFavorites);

// Remove service from favorites
router.delete('/remove/:serviceId', removeFromFavorites);

// Get user's favorites
router.get('/', getFavorites);

// Check if service is in favorites
router.get('/check/:serviceId', checkFavorite);

module.exports = router; 