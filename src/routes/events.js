const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.post('/sessions', eventController.createSession); // POST /events/sessions
router.put('/sessions/:sessionID/end', eventController.endSession);
router.get('/report/:sessionID', eventController.getReport);

module.exports = router;