// const mongoose = require('mongoose');

// const SessionSchema = new mongoose.Schema({
//   candidateName: { type: String, required: true },
//   startTime: { type: Date, default: Date.now },
//   endTime: { type: Date },
//   videoPath: { type: String },
//   integrityScore: { type: Number }
// });

// module.exports = mongoose.model('Session', SessionSchema);
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  candidateName: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  videoPath: { type: String },
  integrityScore: { type: Number }
});

module.exports = mongoose.model('Session', SessionSchema);