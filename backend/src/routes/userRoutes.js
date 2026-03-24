const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  updateUser, 
  deleteUser,
  getResetRequests,
  approveResetRequest,
  rejectResetRequest
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes represent administrative actions in the organizational directory
router.use(protect);
router.use(authorize('admin'));

router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

// Password Reset Requests
router.get('/reset-requests', getResetRequests);
router.post('/reset-requests/:id/approve', approveResetRequest);
router.post('/reset-requests/:id/reject', rejectResetRequest);

module.exports = router;
