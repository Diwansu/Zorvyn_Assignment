const express = require('express');
const router = express.Router();
const { 
    viewRecords, 
    createRecord, 
    updateRecord, 
    deleteRecord, 
    getRecordById 
} = require('../controllers/recordController');

const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All record routes require authentication, so apply `protect` middleware to all routes
router.use(protect);

// Routes for Analyst & Admin
router.get('/', authorize('Analyst', 'Admin'), viewRecords);
router.post('/', authorize('Admin'), createRecord);

router.get('/:id', authorize('Analyst', 'Admin'), getRecordById);
router.put('/:id', authorize('Admin'), updateRecord);
router.delete('/:id', authorize('Admin'), deleteRecord);

module.exports = router;
