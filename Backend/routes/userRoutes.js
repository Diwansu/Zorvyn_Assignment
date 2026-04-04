const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, updateUserStatus } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

// All user routes require authentication and Admin role
router.use(protect, authorize('Admin'));

router.get('/', getUsers);
router.put('/:id/role', updateUserRole);
router.put('/:id/status', updateUserStatus);

module.exports = router;
