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