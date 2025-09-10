const mongoose = require('mongoose');
const ProgressSchema = new mongoose.Schema({
  userId:{ type: mongoose.Schema.Types.ObjectId, ref:'User', required:true, unique:true },
  completedProblems:[ { problemId:{ type: mongoose.Schema.Types.ObjectId, ref:'Problem' }, completedAt: Date } ],
  updatedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Progress', ProgressSchema);
