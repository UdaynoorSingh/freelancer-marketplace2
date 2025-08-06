const express = require('express');
const router = express.Router();
const { addToFavorites, removeFromFavorites, getFavorites, checkFavorite } = require('../controllers/favoritesController');
const auth = require('../middlewares/auth');

router.use(auth);

router.post('/add', addToFavorites);

router.delete('/remove/:serviceId', removeFromFavorites);

router.get('/', getFavorites);

router.get('/check/:serviceId', checkFavorite);

module.exports = router; 