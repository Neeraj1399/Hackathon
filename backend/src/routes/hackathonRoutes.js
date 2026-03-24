const express = require('express');
const {
  getHackathons,
  getHackathon,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  inviteJudge,
  getJoinedHackathons,
  getGlobalStats,
  getJudgeStats,
  announceResults
} = require('../controllers/hackathonController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/stats/overview', protect, authorize('admin'), getGlobalStats);
router.get('/stats/judge', protect, authorize('judge'), getJudgeStats);

router.get('/judging/me', protect, authorize('judge'), getJoinedHackathons);

router
  .route('/')
  .get(getHackathons)
  .post(protect, authorize('admin'), createHackathon);

router
  .route('/:id')
  .get(getHackathon)
  .put(protect, authorize('admin'), updateHackathon)
  .delete(protect, authorize('admin'), deleteHackathon);

router.post('/:id/invite-judge', protect, authorize('admin', 'judge'), inviteJudge);
router.put('/:id/complete', protect, authorize('admin'), announceResults);

module.exports = router;
