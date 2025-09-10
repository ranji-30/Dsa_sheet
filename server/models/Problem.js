const mongoose = require('mongoose');

const ProblemSchema = new mongoose.Schema({
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true },
  title: { type: String, required: true },                 // Problem name
  description: { type: String },                           // Optional details
  level: { type: String, enum: ['easy', 'medium', 'hard'], default: 'easy' },
  youtubeLink: { type: String },
  leetcodeLink: { type: String },
  articleLink: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Problem', ProblemSchema);
