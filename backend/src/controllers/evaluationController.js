const Evaluation = require('../models/Evaluation');
const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');

// @desc    Score a project submission (Create or Update)
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
    if (!hackathon.judges.some(id => id.toString() === req.user.id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized as a judge for this hackathon' });
    }

    // Check if hackathon is completed
    if (hackathon.isCompleted) {
      return res.status(400).json({ success: false, message: 'Evaluations are locked after result announcement' });
    }

    console.log('--- [COMMIT REQUEST] Evaluating Submission:', submissionId, '---');
    console.log('--- [PAYLOAD] Inn:', innovation, 'Imp:', impact, 'Tech:', technical, '---');
    
    const totalScore = Number(innovation) + Number(impact) + Number(technical);
    console.log('--- [CALCULATED] TotalScore:', totalScore, '---');

    // Check if evaluation already exists for this judge/submission (Upsert)
    let evaluation = await Evaluation.findOne({ submissionId, judgeId: req.user.id });
    console.log('--- [EXISTING CHECK] Found:', !!evaluation, '---');

    if (evaluation) {
      console.log('--- [UPDATING] Existing Record ID:', evaluation._id, '---');
      evaluation.innovation = innovation;
      evaluation.impact = impact;
      evaluation.technical = technical;
      evaluation.totalScore = totalScore;
      evaluation.feedback = feedback;
      await evaluation.save();
      console.log(`--- [SUCCESS] Evaluation Updated for Sub: ${submissionId} ---`);
    } else {
      console.log('--- [CREATING] New Registry Entry ---');
      evaluation = await Evaluation.create({
        submissionId,
        judgeId: req.user.id,
        innovation,
        impact,
        technical,
        totalScore,
        feedback
      });
      console.log(`--- [SUCCESS] Evaluation Created for Sub: ${submissionId} ---`);
    }
    
    // Update submission status
    submission.status = 'reviewed';
    await submission.save();

    res.status(200).json({ success: true, data: evaluation });
  } catch (err) {
    console.error('!!! [COMMIT ERROR] Judicial Synchronization Failed !!!', err);
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
          participantName: sub.userId?.name || 'Anonymous'
        };
      })
    );

    leaderboard.sort((a, b) => b.averageScore - a.averageScore);
    const rankedLeaderboard = leaderboard.map((item, index) => ({ rank: index + 1, ...item }));

    res.status(200).json({ success: true, data: rankedLeaderboard });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get current judge's evaluation for a submission
// @route   GET /api/evaluations/judge-audit/:submissionId
// @access  Private (Judge)
exports.getJudgeEvaluation = async (req, res) => {
  try {
    console.log('!!! [REGISTRY HIT] Judge Audit Protocol Activated !!!');
    console.log(`--- [METADATA] Sub ID: ${req.params.submissionId} | Judge: ${req.user.name} ---`);
    const evaluation = await Evaluation.findOne({ 
      submissionId: req.params.submissionId, 
      judgeId: req.user.id 
    });
    res.status(200).json({ success: true, data: evaluation });
  } catch (err) {
    console.error('!!! [REGISTRY ERROR] Judicial Lookup Failed !!!', err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get evaluations for current user's submission
// @route   GET /api/evaluations/my/:submissionId
// @access  Private (Participant)
exports.getMyEvaluation = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ submissionId: req.params.submissionId }).populate('judgeId', 'name');
    res.status(200).json({ success: true, count: evaluations.length, data: evaluations });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
