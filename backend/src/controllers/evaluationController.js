const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');

// @desc    Score a project submission
// @route   POST /api/evaluations
// @access  Private (Judge)
exports.createEvaluation = async (req, res) => {
  try {
    const { submissionId, innovation, impact, technical, feedback } = req.body;

    // Check if submission exists
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Check if user is a judge for this hackathon
    const hackathon = await Hackathon.findById(submission.hackathonId);
    if (!hackathon.judges.includes(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to judge this hackathon' });
    }

    const evaluation = await Evaluation.create({
      submissionId,
      judgeId: req.user.id,
      innovation,
      impact,
      technical,
      feedback
    });

    res.status(201).json({ success: true, data: evaluation });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get evaluations for a submission
// @route   GET /api/evaluations/submission/:submissionId
// @access  Private (Admin/Judge)
exports.getSubmissionEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ submissionId: req.params.submissionId }).populate('judgeId', 'name email');
    res.status(200).json({ success: true, count: evaluations.length, data: evaluations });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get leaderboard for a hackathon
// @route   GET /api/evaluations/leaderboard/:hackathonId
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { hackathonId } = req.params;

    // Find all submissions for the hackathon
    const submissions = await Submission.find({ hackathonId }).populate('userId', 'name');

    const leaderboard = await Promise.all(
      submissions.map(async (sub) => {
        const evaluations = await Evaluation.find({ submissionId: sub._id });
        const avgScore = evaluations.length > 0 
          ? evaluations.reduce((acc, curr) => acc + curr.totalScore, 0) / evaluations.length
          : 0;
        return {
          ...sub.toObject(),
          averageScore: parseFloat(avgScore.toFixed(2)),
          evalCount: evaluations.length,
          participantName: sub.userId.name
        };
      })
    );

    leaderboard.sort((a, b) => b.averageScore - a.averageScore);

    const rankedLeaderboard = leaderboard.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    // Winner Emails (Only if someone asks for leaderboard and it's after deadline)
    const hackathon = await Hackathon.findById(hackathonId);
    if (hackathon && new Date() > hackathon.submissionDeadline) {
      const { sendWinnerEmail } = require('../utils/emailService');
      // Send to the top person if they have a non-zero score
      if (rankedLeaderboard.length > 0 && rankedLeaderboard[0].averageScore > 0) {
        // Need user email
        const topSubmission = await Submission.findById(rankedLeaderboard[0]._id).populate('userId', 'email');
        if (topSubmission && topSubmission.userId.email) {
          await sendWinnerEmail(topSubmission.userId.email, hackathon.title, 1);
        }
      }
    }

    res.status(200).json({ success: true, data: rankedLeaderboard });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get evaluations for the current user's submission
// @route   GET /api/evaluations/my/:submissionId
// @access  Private (Participant)
exports.getMyEvaluation = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Verify submission belongs to user
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    if (submission.userId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view these evaluations' });
    }

    const evaluations = await Evaluation.find({ submissionId }).populate('judgeId', 'name');
    res.status(200).json({ success: true, count: evaluations.length, data: evaluations });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
