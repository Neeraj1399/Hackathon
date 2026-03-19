const express = require('express');
const {
  createEvaluation,
  getSubmissionEvaluations,
  getLeaderboard
} = require('../controllers/evaluationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('judge'), createEvaluation);
router.get('/submission/:submissionId', protect, authorize('admin', 'judge'), getSubmissionEvaluations);
router.get('/leaderboard/:hackathonId', getLeaderboard);

module.exports = router;
