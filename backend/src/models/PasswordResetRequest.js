const mongoose = require('mongoose');

const passwordResetRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  adminNote: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
