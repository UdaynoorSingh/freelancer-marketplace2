// src/controllers/serviceController.js
const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');
const Review = require('../models/Review');

// ✅ Search services by query (title, description, tags) and category
exports.searchServices = async (req, res) => {
    try {
        const { query, category } = req.query;
        const filter = {};

        if (category) {
            filter.category = category;
        }

        if (query) {
            const regex = new RegExp(query, 'i'); // case-insensitive search
            filter.$or = [
                { title: regex },
                { description: regex },
                { tags: regex }
            ];
        }

        const services = await Service.find(filter)
            .populate('seller', '_id username email');

        // For each service, fetch reviews and calculate avg rating/count
        const servicesWithRatings = await Promise.all(services.map(async (service) => {
            const reviews = await Review.find({ gigId: service._id });
            const reviewCount = reviews.length;
            const avgRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) : 0;
            return {
                ...service.toObject(),
                avgRating: avgRating.toFixed(1),
                reviewCount,
            };
        }));

        res.json(servicesWithRatings);
    } catch (err) {
        res.status(500).json({ message: 'Error searching services', error: err.message });
    }
};

// ✅ Get user's own gigs (for freelancer dashboard)
exports.getMyGigs = async (req, res) => {
    try {
        const services = await Service.find({ seller: req.user.id })
            .populate('seller', '_id username email');

        // For each service, fetch reviews and calculate avg rating/count
        const servicesWithRatings = await Promise.all(services.map(async (service) => {
            const reviews = await Review.find({ gigId: service._id });
            const reviewCount = reviews.length;
            const avgRating = reviewCount > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount) : 0;
            return {
                ...service.toObject(),
                avgRating: avgRating.toFixed(1),
                reviewCount,
            };
        }));

        res.json(servicesWithRatings);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching your gigs', error: err.message });
    }
};

// ✅ Get a single service by ID
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('seller', '_id username email');

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching service', error: err.message });
    }
};

// ✅ Create a new service (gig) with multiple images
exports.createService = async (req, res) => {
    try {
        const {
            title,
            description,
            tags,
            price,
            category,
            seller
        } = req.body;

        const tagsArray = Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags.split(',').map(t => t.trim())
                : [];

        // Handle multiple images
        const images = req.files ? req.files.map(f => f.filename) : [];

        const service = new Service({
            title,
            description,
            tags: tagsArray,
            price,
            category,
            seller,
            images
        });

        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service', error: err.message });
    }
};

// ✅ Update a service (gig) by ID
exports.updateService = async (req, res) => {
    try {
        const { title, description, tags, price, category } = req.body;
        const tagsArray = Array.isArray(tags)
            ? tags
            : typeof tags === 'string'
                ? tags.split(',').map(t => t.trim())
                : [];
        const update = {
            title,
            description,
            tags: tagsArray,
            price,
            category,
        };
        if (req.files && req.files.length > 0) {
            update.images = req.files.map(f => f.filename);
        }
        const service = await Service.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        res.json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error updating service', error: err.message });
    }
};

// ✅ Delete a service (gig) by ID
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        // Optionally, delete images from disk
        if (service.images && service.images.length > 0) {
            service.images.forEach(img => {
                const imgPath = path.join(__dirname, '../../uploads', img);
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
            });
        }
        await service.deleteOne();
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting service', error: err.message });
    }
};
