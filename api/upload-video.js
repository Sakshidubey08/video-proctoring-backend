const mongoose = require('mongoose');
const multer = require('multer');
const { put } = require('@vercel/blob');
const Session = require('../src/models/Session');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proctoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const upload = multer({ storage: multer.memoryStorage() });

module.exports = async (req, res) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }
    try {
      const sessionID = req.params.sessionID;
      const session = await Session.findById(sessionID);
      if (!session) return res.status(404).json({ message: 'Session not found' });

      const { url } = await put(`videos/${sessionID}.webm`, req.file.buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      session.videoPath = url;
      await session.save();
      res.json({ success: true, videoLink: url });
    } catch (error) {
      console.error('Upload video error:', error);
      res.status(500).json({ message: error.message });
    }
  });
};