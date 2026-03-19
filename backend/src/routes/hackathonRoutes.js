const express = require('express');
const {
  getHackathons,
  getHackathon,
  createHackathon,
  updateHackathon,
  deleteHackathon,
  requestToJudge,
  getJudgeRequests,
  approveJudgeRequest,
  getJoinedHackathons
} = require('../controllers/hackathonController');

const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

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

router.post('/:id/judge-request', protect, authorize('judge'), requestToJudge);

router
  .route('/:id/judge-requests')
  .get(protect, authorize('admin'), getJudgeRequests);

router.put('/:id/judge-requests/:requestId', protect, authorize('admin'), approveJudgeRequest);

module.exports = router;
