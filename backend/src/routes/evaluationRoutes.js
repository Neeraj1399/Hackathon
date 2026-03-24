const express = require('express');
const {
  createEvaluation,
  getSubmissionEvaluations,
  getLeaderboard,
  getMyEvaluation,
  getJudgeEvaluation
} = require('../controllers/evaluationController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// JUDGING ENGINE ROUTES
console.log('--- Evaluation Registry Routes Initialized ---');

router.post('/', protect, authorize('judge'), createEvaluation);
router.get('/submission/:submissionId', protect, authorize('admin', 'judge'), getSubmissionEvaluations);
router.get('/my/:submissionId', protect, getMyEvaluation);
router.get('/judge-audit/:submissionId', protect, authorize('judge'), getJudgeEvaluation);
router.get('/leaderboard/:hackathonId', getLeaderboard);

// REGISTRY MONITOR
router.use((req, res) => {
  console.log(`--- [REGISTRY MISS] No Match for ${req.method} ${req.originalUrl} ---`);
  res.status(404).json({ success: false, message: 'Endpoint not registered in Judicial Matrix' });
});

module.exports = router;
