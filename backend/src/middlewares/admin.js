module.exports = (req, res, next) => {
    console.log('Admin middleware check:', req.user, 'Admin:', process.env.ADMIN_EMAIL);
    if (req.user && req.user.email === process.env.ADMIN_EMAIL) {
        return next();
    }
    return res.status(403).json({ message: 'Admin access required.' });
}; 