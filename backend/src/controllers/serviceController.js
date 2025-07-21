const Service = require('../models/Service');
const fs = require('fs');
const path = require('path');

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

        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Error searching services', error: err.message });
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

// ✅ Create a new service (gig) with optional image
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

        const image = req.file ? req.file.filename : null;

        const service = new Service({
            title,
            description,
            tags: tagsArray,
            price,
            category,
            seller,
            image
        });

        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(500).json({ message: 'Error creating service', error: err.message });
    }
};
