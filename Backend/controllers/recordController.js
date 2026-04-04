const Record = require('../models/Record');

// Get all records (Analyst, Admin)
// Supports optional filtering: ?type=income&category=Salary&startDate=2024-01-01&endDate=2024-01-31
const viewRecords = async (req, res, next) => {
    try {
        const { type, category, startDate, endDate, sort } = req.query;
        let query = {};

        // Apply filters if provided
        if (type) query.type = type;
        if (category) query.category = category;
        
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate); //gte means greater than or equal to
            if (endDate) query.date.$lte = new Date(endDate); //lte means less than or equal to
        }

        // Apply sorting
        let sortOption = { date: -1 }; // Default new to old
        if (sort === 'oldest') sortOption = { date: 1 }; //oldest means sort by date in ascending order
        if (sort === 'amount_high') sortOption = { amount: -1 }; //amount_high means sort by amount in descending order
        if (sort === 'amount_low') sortOption = { amount: 1 }; //amount_low means sort by amount in ascending order

        const records = await Record.find(query)
            .populate('createdBy', 'name email role') //populate means to replace the _id with the actual object
            .sort(sortOption);

        res.status(200).json({ count: records.length, data: records }); 
    } catch (err) {
        next(err);
    }
};

// Create new record (Admin)
const createRecord = async (req, res, next) => {
    try {
        const { amount, type, category, date, notes } = req.body;
        
        // createdBy comes from the auth middleware
        const createdBy = req.user._id;

        const record = await Record.create({
            amount,
            type,
            category,
            date: date ? new Date(date) : Date.now(),
            notes,
            createdBy
        });

        res.status(201).json(record);
    } catch (err) {
        next(err);
    }
};

// Update record (Admin)
const updateRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // Find record
        let record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        // Update record
        const updatedRecord = await Record.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json(updatedRecord);
    } catch (err) {
        next(err);
    }
};

// Delete record (Admin)
const deleteRecord = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const record = await Record.findById(id);
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }

        await record.deleteOne();
        res.status(200).json({ message: 'Record deleted successfully', id });
    } catch (err) {
        next(err);
    }
};

// Get single record (Analyst, Admin)
const getRecordById = async (req, res, next) => {
    try {
        const record = await Record.findById(req.params.id)
            .populate('createdBy', 'name email');
            
        if (!record) {
            return res.status(404).json({ message: 'Record not found' });
        }
        res.status(200).json(record);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    viewRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordById
};
