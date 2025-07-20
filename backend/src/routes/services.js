const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

// Search services
router.get('/search', serviceController.searchServices);

module.exports = router; 