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
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.post('/sessions', eventController.createSession);
router.put('/sessions/:sessionID/end', eventController.endSession);
router.get('/report/:sessionID', eventController.getReport);

module.exports = router;