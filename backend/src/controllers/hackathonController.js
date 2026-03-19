const Hackathon = require('../models/Hackathon');

// @desc    Get all hackathons
// @route   GET /api/hackathons
// @access  Public
exports.getHackathons = async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ isActive: true }).populate('judgeRequests.user', 'name email');
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
    const hackathon = await Hackathon.findById(req.params.id);
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
    let hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
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
// @desc    Request to judge a hackathon
// @route   POST /api/hackathons/:id/judge-request
// @access  Private (Judge)
exports.requestToJudge = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check if user is already a judge
    if (hackathon.judges.some(j => j.toString() === req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already an assigned judge for this event' });
    }

    // Check if user has a pending request
    const existingRequest = hackathon.judgeRequests.find(
      (r) => r.user.toString() === req.user.id
    );
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'Judge request already sent or processed' });
    }

    hackathon.judgeRequests.push({ user: req.user.id });
    await hackathon.save();

    res.status(200).json({ success: true, message: 'Judge request sent successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all judge requests for a hackathon
// @route   GET /api/hackathons/:id/judge-requests
// @access  Private (Admin)
exports.getJudgeRequests = async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id).populate('judgeRequests.user', 'name email');
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }
    res.status(200).json({ success: true, data: hackathon.judgeRequests });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Approve/Reject judge request
// @route   PUT /api/hackathons/:id/judge-requests/:requestId
// @access  Private (Admin)
exports.approveJudgeRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    const request = hackathon.judgeRequests.id(req.params.requestId);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;

    if (status === 'approved') {
      // Add user to judges array if not already there
      const isAlreadyJudge = hackathon.judges.some(j => j.toString() === request.user.toString());
      if (!isAlreadyJudge) {
        hackathon.judges.push(request.user);
      }
    }

    await hackathon.save();

    const populatedHackathon = await Hackathon.findById(req.params.id).populate('judgeRequests.user', 'email');
    const userToNotify = populatedHackathon.judgeRequests.find(r => r._id.toString() === req.params.requestId)?.user;

    const { sendJudgeStatusEmail } = require('../utils/emailService');
    if (userToNotify && userToNotify.email) {
      await sendJudgeStatusEmail(userToNotify.email, hackathon.title, status);
    }

    res.status(200).json({ success: true, data: hackathon });
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
