// const Event = require('../models/Event');

// // Save event (focus lost, phone detected, etc.)
// exports.createEvent = async (req, res) => {
//   try {
//     const newEvent = new Event(req.body);
//     await newEvent.save();
//     res.status(201).json(newEvent);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Retrieve all events (for report generation)
// exports.getAllEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Get report
// exports.getReport = async (req, res) => {
//   try {
//     const { sessionID } = req.params;
//     const session = await Session.findById(sessionID);
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     const events = await Event.find({ sessionID });
    
//     const duration = Math.round((session.endTime - session.startTime) / 1000 / 60); // minutes
    
//     let focusLost = 0;
//     let suspicious = 0;
//     events.forEach(e => {
//       if (e.type === 'attention') focusLost++;
//       if (e.type === 'violation') suspicious++;
//     });
    
//     const deductions = 5 * focusLost + 10 * suspicious;
//     const score = Math.max(100 - deductions, 0);
//     session.integrityScore = score;
//     await session.save();
    
//     const report = {
//       candidateName: session.candidateName,
//       interviewDuration: `${duration} minutes`,
//       numberOfTimesFocusLost: focusLost,
//       suspiciousEvents: events.map(e => `${e.event} at ${e.time}`),
//       finalIntegrityScore: score
//     };
    
//     res.json(report);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// Get report

//////////second
// exports.getReport = async (req, res) => {
//   try {
//     const { sessionID } = req.params;
//     const session = await Session.findById(sessionID);
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     const events = await Event.find({ sessionID });
    
//     const duration = Math.round((session.endTime - session.startTime) / 1000 / 60); // minutes
    
//     let focusLost = 0;
//     let suspicious = 0;
//     events.forEach(e => {
//       if (e.type === 'attention') focusLost++;
//       if (e.type === 'violation') suspicious++;
//     });
    
//     const deductions = 5 * focusLost + 10 * suspicious;
//     const score = Math.max(100 - deductions, 0);
//     session.integrityScore = score;
//     await session.save();
    
//     const report = {
//       candidateName: session.candidateName,
//       interviewDuration: `${duration} minutes`,
//       numberOfTimesFocusLost: focusLost,
//       suspiciousEvents: events.map(e => `${e.event} at ${e.time}`),
//       finalIntegrityScore: score,
//       videoLink: `http://localhost:5000/videos/${sessionID}` // Generate video link
//     };
    
//     res.json(report);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
const Event = require('../models/Event'); // Only once at the top
const Session = require('../models/Session');

exports.createEvent = async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { candidateName } = req.body;
    const session = new Session({ candidateName });
    await session.save();
    res.status(201).json({ sessionID: session._id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.endSession = async (req, res) => {
  try {
    const { sessionID } = req.params;
    const session = await Session.findById(sessionID);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.endTime = new Date();
    await session.save();
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReport = async (req, res) => {
  try {
    const { sessionID } = req.params;
    const session = await Session.findById(sessionID);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    const events = await Event.find({ sessionID });
    
    const duration = Math.round((session.endTime - session.startTime) / 1000 / 60);
    let focusLost = 0;
    let suspicious = 0;
    events.forEach(e => {
      if (e.type === 'attention') focusLost++;
      if (e.type === 'violation') suspicious++;
    });
    
    const deductions = 5 * focusLost + 10 * suspicious;
    const score = Math.max(100 - deductions, 0);
    session.integrityScore = score;
    await session.save();
    
    const report = {
      candidateName: session.candidateName,
      interviewDuration: `${duration} minutes`,
      numberOfTimesFocusLost: focusLost,
      suspiciousEvents: events.map(e => `${e.event} at ${e.time}`),
      finalIntegrityScore: score,
      videoLink: session.videoPath || `http://localhost:5000/videos/${sessionID}`
    };
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};