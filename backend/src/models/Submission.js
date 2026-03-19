const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  hackathonId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hackathon',
    required: true
  },
  projectTitle: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a project description']
  },
  githubLink: {
    type: String,
    required: [true, 'Please add a GitHub link']
  },
  demoLink: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one submission per user per hackathon
submissionSchema.index({ userId: 1, hackathonId: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
