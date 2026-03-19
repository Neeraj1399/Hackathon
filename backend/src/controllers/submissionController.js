const Submission = require('../models/Submission');
const Hackathon = require('../models/Hackathon');

// @desc    Submit a project
// @route   POST /api/submissions
// @access  Private (Participant)
exports.submitProject = async (req, res) => {
  try {
    const { hackathonId, projectTitle, description, githubLink, demoLink } = req.body;

    // Check if hackathon exists
    const hackathon = await Hackathon.findById(hackathonId);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: 'Hackathon not found' });
    }

    // Check deadline
    if (new Date() > new Date(hackathon.submissionDeadline)) {
      return res.status(400).json({ success: false, message: 'Submission deadline has passed' });
    }

    // Check if user already submitted
    const existingSubmission = await Submission.findOne({ userId: req.user.id, hackathonId });
    if (existingSubmission) {
      return res.status(400).json({ success: false, message: 'You have already submitted a project for this hackathon' });
    }

    const submission = await Submission.create({
      userId: req.user.id,
      hackathonId,
      projectTitle,
      description,
      githubLink,
      demoLink
    });

    res.status(201).json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update a submission
// @route   PUT /api/submissions/:id
// @access  Private (Participant)
exports.updateSubmission = async (req, res) => {
  try {
    let submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found' });
    }

    // Make sure user is submission owner
    if (submission.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this submission' });
    }

    // Check deadline of the hackathon
    const hackathon = await Hackathon.findById(submission.hackathonId);
    if (new Date() > new Date(hackathon.submissionDeadline)) {
      return res.status(400).json({ success: false, message: 'Submission deadline has passed. Cannot edit.' });
    }

    req.body.updatedAt = Date.now();
    submission = await Submission.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: submission });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get user's submissions
// @route   GET /api/submissions/my
// @access  Private (Participant)
exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.id }).populate('hackathonId', 'title');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get all submissions for a hackathon (for Admin/Judge)
// @route   GET /api/submissions/hackathon/:hackathonId
// @access  Private (Admin/Judge)
exports.getHackathonSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ hackathonId: req.params.hackathonId }).populate('userId', 'name email');
    res.status(200).json({ success: true, count: submissions.length, data: submissions });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
