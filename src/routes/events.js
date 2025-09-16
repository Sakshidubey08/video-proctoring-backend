const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController'); // Ensure this path is correct

router.post('/', eventController.createEvent);
router.get('/', eventController.getAllEvents);
router.post('/sessions', eventController.createSession);
router.put('/sessions/:sessionID/end', eventController.endSession);
router.get('/report/:sessionID', eventController.getReport);

module.exports = router;