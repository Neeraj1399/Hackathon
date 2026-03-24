const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  submissionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Submission',
    required: true
  },
  judgeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  innovation: {
    type: Number,
    required: [true, 'Please add a score for innovation'],
    min: 0,
    max: 10
  },
  impact: {
    type: Number,
    required: [true, 'Please add a score for impact'],
    min: 0,
    max: 10
  },
  technical: {
    type: Number,
    required: [true, 'Please add a score for technical execution'],
    min: 0,
    max: 10
  },
  totalScore: {
    type: Number,
    required: true
  },
  feedback: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Scored computed in controller for synchronization integrity

// Ensure one judge can evaluate a submission only once
evaluationSchema.index({ submissionId: 1, judgeId: 1 }, { unique: true });

// High-frequency query indexes
evaluationSchema.index({ judgeId: 1 });
evaluationSchema.index({ submissionId: 1 });

module.exports = mongoose.model('Evaluation', evaluationSchema);
