const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  rules: {
    type: String,
    required: [true, 'Please add rules']
  },
  startDate: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  endDate: {
    type: Date,
    required: [true, 'Please add an end date']
  },
  submissionDeadline: {
    type: Date,
    required: [true, 'Please add a submission deadline']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  judges: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  isStartEmailSent: { type: Boolean, default: false },
  isDeadlineAlertSent: { type: Boolean, default: false },
  isEndEmailSent: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false }
},
{ timestamps: true }
);

// High-frequency query indexes
hackathonSchema.index({ isActive: 1 });
hackathonSchema.index({ judges: 1 });
hackathonSchema.index({ submissionDeadline: 1 });

module.exports = mongoose.model('Hackathon', hackathonSchema);
