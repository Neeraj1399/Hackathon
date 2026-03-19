const express = require('express');
const {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement
} = require('../controllers/announcementController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getAnnouncements)
  .post(protect, authorize('admin'), createAnnouncement);

router.delete('/:id', protect, authorize('admin'), deleteAnnouncement);

module.exports = router;
