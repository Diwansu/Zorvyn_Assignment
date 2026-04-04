const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// Dashboard endpoints require authentication
router.use(protect);

// Dashboards can be seen by all roles
router.get('/summary', authorize('Viewer', 'Analyst', 'Admin'), getSummary);


module.exports = router;
