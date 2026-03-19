const express = require('express');
const {
  submitProject,
  updateSubmission,
  getMySubmissions,
  getHackathonSubmissions
} = require('../controllers/submissionController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', authorize('participant'), submitProject);
router.put('/:id', authorize('participant'), updateSubmission);
router.get('/my', authorize('participant'), getMySubmissions);
router.get('/hackathon/:hackathonId', authorize('admin', 'judge'), getHackathonSubmissions);

module.exports = router;
