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
    type: String
  },
  demoLink: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed'],
    default: 'pending'
  },
  comments: [{
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    userName: String,
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Ensure one submission per user per hackathon
submissionSchema.index({ userId: 1, hackathonId: 1 }, { unique: true });

// High-frequency query indexes
submissionSchema.index({ hackathonId: 1 });
submissionSchema.index({ userId: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
