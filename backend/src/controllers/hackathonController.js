const Hackathon = require('../models/Hackathon');
const User = require('../models/User');
const Submission = require('../models/Submission');
const Evaluation = require('../models/Evaluation');

// @desc    Get hackathon statistics for a judge
// @route   GET /api/hackathons/stats/judge
// @access  Private (Judge)
exports.getJudgeStats = async (req, res) => {
  try {
    const judgeId = req.user.id;
    
    // Find all hackathons where this judge is assigned
    const assignedHackathons = await Hackathon.find({ judges: judgeId });
    const hackathonIds = assignedHackathons.map(h => h._id);

    // Count all submissions in these hackathons
    const assignedSubmissionsCount = await Submission.countDocuments({ 
      hackathonId: { $in: hackathonIds } 
    });

    // Count how many this judge has already evaluated
    const reviewedCount = await Evaluation.countDocuments({ judgeId });

    // Pending = assigned submissions - reviewed
    const pendingReviews = Math.max(0, assignedSubmissionsCount - reviewedCount);

    res.status(200).json({
      success: true,
      data: {
        assignedSubmissions: assignedSubmissionsCount,
        reviewedCount,
        pendingReviews
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get global statistics
// @route   GET /api/hackathons/stats/overview
// @access  Private (Admin)
exports.getGlobalStats = async (req, res) => {
  try {
    const [totalParticipants, totalSubmissions, activeTracks, evaluatedCount] = await Promise.all([
      User.countDocuments({ systemRole: 'participant' }),
      Submission.countDocuments(),
      Hackathon.countDocuments({ isActive: true }),
      Evaluation.distinct('submissionId').then(ids => ids.length)
    ]);

    const pendingReviews = Math.max(0, totalSubmissions - evaluatedCount);

    res.status(200).json({
      success: true,
      data: {
        totalParticipants,
        totalSubmissions,
        activeTracks,
        pendingReviews
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ isActive: true }).populate('judges', 'name email').lean();
    res.status(200).json({ success: true, count: hackathons.length, data: hackathons });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get single hackathon
// @route   GET /api/hackathons/:id
// @access  Public
exports.getHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).lean();
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    res.status(200).json({ success: true, data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Create hackathon
// @route   POST /api/hackathons
// @access  Private (Admin)
exports.createHackathon = async (req, res) => {
  try {
    const { title, startDate } = req.body;
    
    // Check for duplicate title on the same day
    const date = new Date(startDate);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const existing = await Hackathon.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
      startDate: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'A hackathon with this title is already scheduled for this day.' 
      });
    }

    req.body.createdBy = req.user.id;
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json({ success: true, data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update hackathon
// @route   PUT /api/hackathons/:id
// @access  Private (Admin)
exports.updateHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    
    // Whitelist updatable fields
    const fields = ['title', 'description', 'rules', 'startDate', 'endDate', 'submissionDeadline', 'isActive', 'isCompleted'];
    fields.forEach(f => {
      if (req.body[f] !== undefined) {
        hackathon[f] = req.body[f];
      }
    });

    await hackathon.save();
    res.status(200).json({ success: true, data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete hackathon
// @route   DELETE /api/hackathons/:id
// @access  Private (Admin)
exports.deleteHackathon = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    await hackathon.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Invite a judge to a hackathon
// @route   POST /api/hackathons/:id/invite-judge
// @access  Private (Admin)
exports.inviteJudge = async (req, res) => {
  try {
    const { userId } = req.body;
    const hackathon = await Hackathon.findById(req.params.id);
    
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    const userToInvite = await User.findById(userId);
    if (!userToInvite || userToInvite.systemRole !== 'judge') {
      return res.status(400).json({ success: false, message: 'Invalid judge user' });
    }

    // Check if already a judge
    if (hackathon.judges.includes(userId)) {
      return res.status(400).json({ success: false, message: 'User is already a judge for this hackathon' });
    }

    hackathon.judges.push(userId);
    await hackathon.save();

    // Send Invitation Email
    const { sendJudgeInviteEmail } = require('../utils/emailService');
    await sendJudgeInviteEmail(userToInvite.email, hackathon.title);

    res.status(200).json({ success: true, message: 'Judge invited successfully', data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get hackathons where user is an approved judge
// @route   GET /api/hackathons/judging/me
// @access  Private (Judge)
exports.getJoinedHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ judges: req.user.id });
    res.status(200).json({ success: true, count: hackathons.length, data: hackathons });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// @desc    Announce results (mark hackathon as complete)
// @route   PUT /api/hackathons/:id/complete
// @access  Private (Admin)
exports.announceResults = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check for unevaluated submissions
    const force = req.query.force === 'true';
    const submissions = await Submission.find({ hackathonId: hackathon._id });
    const evaluatedSubIds = await Evaluation.distinct('submissionId', {
      submissionId: { $in: submissions.map(s => s._id) }
    });
    const unevaluated = submissions.filter(
      s => !evaluatedSubIds.some(eId => eId.toString() === s._id.toString())
    );

    if (unevaluated.length > 0 && !force) {
      return res.status(200).json({
        success: false,
        warning: true,
        message: `${unevaluated.length} submission(s) have not been evaluated yet.`,
        unevaluatedProjects: unevaluated.map(s => s.projectTitle)
      });
    }

    hackathon.isCompleted = true;
    await hackathon.save();

    res.status(200).json({ success: true, message: 'Results announced successfully', data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
