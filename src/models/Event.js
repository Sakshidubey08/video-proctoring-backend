// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//   event: { type: String, required: true },
//   time: { type: String, required: true },
// });

// module.exports = mongoose.model('Event', EventSchema);
//////////////sec
// const mongoose = require('mongoose');

// const EventSchema = new mongoose.Schema({
//   event: { type: String, required: true },
//   time: { type: String, required: true },
//   type: { type: String },
//   severity: { type: String },
//   sessionID: { type: String, required: true }
// });

// module.exports = mongoose.model('Event', EventSchema);
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  event: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String },
  severity: { type: String },
  sessionID: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);