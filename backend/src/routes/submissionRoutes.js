const express = require('express');
const {
  submitProject,
  updateSubmission,
  getMySubmissions,
  getHackathonSubmissions,
  getAllSubmissions,
  getAssignedSubmissions,
  getSubmission,
  addComment
} = require('../controllers/submissionController');

const { protect, authorize } = require('../middleware/authMiddleware');

console.log('--- Submission Routes Loaded ---');
const router = express.Router();

router.use(protect);

// IMPORTANT: Specific routes first to avoid clash with /:id
router.get('/my', authorize('participant'), getMySubmissions);
router.get('/assigned', authorize('judge'), getAssignedSubmissions);
router.get('/hackathon/:hackathonId', authorize('admin', 'judge'), getHackathonSubmissions);

// JUDICIAL AUDIT PASSTHROUGH (Leveraging verified submission registry)
const { getJudgeEvaluation } = require('../controllers/evaluationController');
router.get('/judge-audit/:submissionId', authorize('judge'), getJudgeEvaluation);

// General routes
router.get('/', getAllSubmissions);
router.post('/', authorize('participant'), submitProject);

// Interaction Protocols
router.post('/:id/comment', addComment);

// ID-based routes last
router.get('/:id', authorize('admin', 'judge', 'participant'), getSubmission);
router.put('/:id', authorize('participant'), updateSubmission);

module.exports = router;
