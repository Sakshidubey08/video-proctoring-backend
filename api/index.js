module.exports = (req, res) => {
  res.json({
    message: 'Video Proctoring Backend API',
    endpoints: {
      sessions: '/events/sessions (POST)',
      events: '/events (POST/GET)',
      report: '/events/report/:sessionID (GET)',
      uploadVideo: '/upload-video/:sessionID (POST)',
      videos: '/videos/:sessionID (GET)'
    }
  });
};