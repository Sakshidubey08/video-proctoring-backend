const mongoose = require('mongoose');
const Session = require('../src/models/Session');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proctoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = async (req, res) => {
  try {
    const sessionID = req.params.sessionID;
    const session = await Session.findById(sessionID);
    if (!session || !session.videoPath) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json({ videoLink: session.videoPath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};