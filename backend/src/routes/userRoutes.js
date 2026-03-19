const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  updateUserRole, 
  deleteUser,
  getResetRequests,
  approveResetRequest,
  rejectResetRequest
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.route('/:id').delete(deleteUser);
router.put('/:id/role', updateUserRole);

// Password Reset Requests
router.get('/reset-requests', getResetRequests);
router.post('/reset-requests/:id/approve', approveResetRequest);
router.post('/reset-requests/:id/reject', rejectResetRequest);

module.exports = router;
