// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');
// const eventRoutes = require('./src/routes/events');
// const Session = require('./src/models/Session'); // Move import to top

// const app = express();
// app.use(cors()); // Allow CORS for frontend (localhost:3000)
// app.use(bodyParser.json()); // Parse JSON body

// // Create uploads folder if not exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Multer storage for video uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.sessionID}.webm`);
//   }
// });
// const upload = multer({ storage });

// // Upload video route
// app.post('/upload-video/:sessionID', upload.single('video'), async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionID); // Use imported Session model
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     session.videoPath = `uploads/${req.params.sessionID}.webm`;
//     await session.save();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/proctoring', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // API routes
// app.use('/events', eventRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// // const express = require('express');
// // const mongoose = require('mongoose');
// // const cors = require('cors');
// // const bodyParser = require('body-parser');
// // const eventRoutes = require('./src/routes/events');

// // const app = express();
// // app.use(cors());          // Allow CORS for frontend (localhost:3000)
// // app.use(bodyParser.json()); // Parse JSON body

// // // MongoDB connection
// // mongoose.connect('mongodb://localhost:27017/proctoring', {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// // .then(() => console.log('MongoDB connected'))
// // .catch((err) => console.error('MongoDB connection error:', err));

// // // API route
// // app.use('/events', eventRoutes);

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//////second/////
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const multer = require('multer');
// const fs = require('fs');
// const path = require('path');

// // Debug: Log current directory to verify path
// console.log('Current directory:', __dirname);

// // Check if Session.js exists
// try {
//   const SessionPath = path.join(__dirname, 'src', 'models', 'Session.js');
//   if (!fs.existsSync(SessionPath)) {
//     console.error(`Session.js not found at ${SessionPath}`);
//   } else {
//     console.log(`Session.js found at ${SessionPath}`);
//   }
// } catch (err) {
//   console.error('Error checking Session.js:', err);
// }

// const Session = require('./src/models/Session');
// const eventRoutes = require('./src/routes/events');

// const app = express();
// app.use(cors()); // Allow CORS for frontend (localhost:3000)
// app.use(bodyParser.json()); // Parse JSON body

// // Create uploads folder if not exists
// const uploadDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Serve video files
// app.get('/videos/:sessionID', (req, res) => {
//   const videoPath = path.join(uploadDir, `${req.params.sessionID}.webm`);
//   if (!fs.existsSync(videoPath)) {
//     return res.status(404).json({ message: 'Video not found' });
//   }
//   res.sendFile(videoPath);
// });

// // Multer storage for video uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${req.params.sessionID}.webm`);
//   }
// });
// const upload = multer({ storage });

// // Upload video route
// app.post('/upload-video/:sessionID', upload.single('video'), async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionID);
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     session.videoPath = `uploads/${req.params.sessionID}.webm`;
//     await session.save();
//     res.json({ success: true });
//   } catch (error) {
//     console.error('Upload video error:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// // MongoDB connection
// mongoose.connect('mongodb://localhost:27017/proctoring', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((err) => console.error('MongoDB connection error:', err));

// // API routes
// app.use('/events', eventRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

console.log('Current directory:', __dirname);

try {
  const SessionPath = path.join(__dirname, 'src', 'models', 'Session.js');
  if (!fs.existsSync(SessionPath)) {
    console.error(`Session.js not found at ${SessionPath}`);
  } else {
    console.log(`Session.js found at ${SessionPath}`);
  }
} catch (err) {
  console.error('Error checking Session.js:', err);
}

const Session = require('./src/models/Session');
const eventRoutes = require('./src/routes/events');

const app = express();
app.use(cors({ origin: 'http://localhost:3000' })); // Allow frontend
app.use(bodyParser.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.get('/videos/:sessionID', (req, res) => {
  const videoPath = path.join(uploadDir, `${req.params.sessionID}.webm`);
  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ message: 'Video not found' });
  }
  res.sendFile(videoPath);
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.params.sessionID}.webm`);
  }
});
const upload = multer({ storage });

app.post('/upload-video/:sessionID', upload.single('video'), async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionID);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    session.videoPath = `uploads/${req.params.sessionID}.webm`;
    await session.save();
    res.json({ success: true });
  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({ message: error.message });
  }
});

mongoose.connect('mongodb://localhost:27017/proctoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/events', eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));