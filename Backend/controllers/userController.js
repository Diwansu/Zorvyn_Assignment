const User = require('../models/User');

// Get all users (Admin only)
const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        const allowedRoles = ['Viewer', 'Analyst', 'Admin'];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User role updated', user });
    } catch (err) {
        next(err);
    }
};

// Update user status (Admin only)
const updateUserStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['active', 'inactive'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status provided' });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User status updated', user });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUsers,
    updateUserRole,
    updateUserStatus
};
