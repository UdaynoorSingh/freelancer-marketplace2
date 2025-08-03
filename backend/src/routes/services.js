// src/routes/services.js

const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const multer = require('multer');
const path = require('path');

// Multer setup for local image storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Search services
router.get('/search', serviceController.searchServices);

// Get user's own gigs (for freelancer dashboard)
router.get('/my-gigs', serviceController.getMyGigs);

// Get a single service by ID
router.get('/:id', serviceController.getService);

// Create a new service (gig) with image upload
router.post('/', upload.array('images', 5), serviceController.createService);

// Update a service (gig) by ID
router.put('/:id', upload.array('images', 5), serviceController.updateService);

// Delete a service (gig) by ID
router.delete('/:id', serviceController.deleteService);

module.exports = router; 