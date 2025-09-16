// const express = require('express');
// const router = express.Router();
// const eventController = require('../controllers/eventController');

// // POST new event (called by frontend when detection occurs)
// router.post('/', eventController.createEvent);

// // GET all events (used to generate report)
// router.get('/', eventController.getAllEvents);

// module.exports = router;
///////////sec
// const express = require('express');
// const router = express.Router();
// const eventController = require('../controllers/eventController');

// // POST new event (called by frontend when detection occurs)
// router.post('/', eventController.createEvent);

// // GET all events (used to generate report)
// router.get('/', eventController.getAllEvents);

// // POST create session
// router.post('/sessions', eventController.createSession);

// // PUT end session
// router.put('/sessions/:sessionID/end', eventController.endSession);

// // GET report
// router.get('/report/:sessionID', eventController.getReport);

// module.exports = router;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const eventRoutes = require('../src/routes/events');

const app = express();

app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(bodyParser.json());

app.use('/events', eventRoutes);

module.exports = app;