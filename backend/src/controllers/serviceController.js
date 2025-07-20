const Service = require('../models/Service');

// Search services by query (title, description, tags) and category
exports.searchServices = async (req, res) => {
    try {
        const { query, category } = req.query;
        const filter = {};
        if (category) {
            filter.category = category;
        }
        if (query) {
            const regex = new RegExp(query, 'i'); // case-insensitive
            filter.$or = [
                { title: regex },
                { description: regex },
                { tags: regex }
            ];
        }
        const services = await Service.find(filter).populate('seller', 'username email');
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Create a new service (gig) with image upload
exports.createService = async (req, res) => {
    try {
        const { title, description, tags, price, category, seller } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const tagsArray = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
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
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 