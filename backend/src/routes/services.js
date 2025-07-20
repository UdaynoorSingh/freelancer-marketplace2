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

// Create a new service (gig) with image upload
router.post('/', upload.single('image'), serviceController.createService);

module.exports = router; 