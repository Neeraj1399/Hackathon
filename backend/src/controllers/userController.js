const crypto = require('crypto');
const User = require('../models/User');
const PasswordResetRequest = require('../models/PasswordResetRequest');
const { sendResetEmail } = require('../utils/emailService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Super Admin Protection
    if (user.email === 'adminhackathon@gmail.com') {
      return res.status(403).json({ success: false, message: 'Cannot modify Super Admin role' });
    }

    user.role = req.body.role;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Update Role Error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Super Admin Protection
    if (user.email === 'adminhackathon@gmail.com') {
      return res.status(403).json({ success: false, message: 'Cannot delete Super Admin' });
    }

    await user.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all password reset requests
// @route   GET /api/users/reset-requests
// @access  Private/Admin
exports.getResetRequests = async (req, res) => {
  try {
    const requests = await PasswordResetRequest.find()
      .populate('user', 'name email')
      .sort('-createdAt');
    res.status(200).json({ success: true, data: requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Approve password reset request
// @route   POST /api/users/reset-requests/:id/approve
// @access  Private/Admin
exports.approveResetRequest = async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id).populate('user');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request already ${request.status}` });
    }

    // 1. Generate reset token for the user
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash token and set to user model
    const user = request.user;
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

    await user.save({ validateBeforeSave: false });

    // 3. Update request status
    request.status = 'approved';
    request.approvedAt = Date.now();
    await request.save();

    // 4. Send real reset email to user
    try {
      await sendResetEmail(user.email, resetToken);
    } catch (emailErr) {
      console.error('Email send failed:', emailErr.message);
    }

    res.status(200).json({ 
      success: true, 
      message: `Reset link sent to ${user.email}` 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reject password reset request
// @route   POST /api/users/reset-requests/:id/reject
// @access  Private/Admin
exports.rejectResetRequest = async (req, res) => {
  try {
    const request = await PasswordResetRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = 'rejected';
    await request.save();

    res.status(200).json({ success: true, message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
