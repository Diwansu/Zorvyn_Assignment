const Record = require('../models/Record');

// Get Dashboard Summary
// Accessible by Viewer, Analyst, Admin
const getSummary = async (req, res, next) => {
    try {
        // Get all records
        const records = await Record.find();

        // Calculate totals using simple loop
        let totalIncome = 0;
        let totalExpense = 0;

        records.forEach(record => {
            if (record.type === 'income') {
                totalIncome += record.amount;
            } else {
                totalExpense += record.amount;
            }
        });

        const netBalance = totalIncome - totalExpense;

        // Category wise totals
        const categoryMap = {};
        records.forEach(record => {
            if (!categoryMap[record.category]) {
                categoryMap[record.category] = 0;
            }
            categoryMap[record.category] += record.amount;
        });

        // Recent 5 records
        const recentActivity = await Record.find()
            .sort({ date: -1 })
            .limit(5)
            .populate('createdBy', 'name email');

        res.status(200).json({
            summary: { totalIncome, totalExpense, netBalance },
            categoryTotals: categoryMap,
            recentActivity
        });

    } catch (err) {
        next(err);
    }
};

module.exports = {
    getSummary
};
