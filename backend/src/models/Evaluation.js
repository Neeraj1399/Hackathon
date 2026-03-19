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
    required: [true, 'Please add feedback']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate total score before saving
evaluationSchema.pre('save', function(next) {
  this.totalScore = this.innovation + this.impact + this.technical;
  next();
});

// Ensure one judge can evaluate a submission only once
evaluationSchema.index({ submissionId: 1, judgeId: 1 }, { unique: true });

module.exports = mongoose.model('Evaluation', evaluationSchema);
