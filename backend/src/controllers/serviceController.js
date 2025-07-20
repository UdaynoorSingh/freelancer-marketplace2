const Service = require('../models/Service');

// Search services by query (title, description, tags)
exports.searchServices = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }
        const regex = new RegExp(query, 'i'); // case-insensitive
        const services = await Service.find({
            $or: [
                { title: regex },
                { description: regex },
                { tags: regex }
            ]
        }).populate('seller', 'username email');
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 