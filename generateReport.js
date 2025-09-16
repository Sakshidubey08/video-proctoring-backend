// const mongoose = require('mongoose');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const Session = require('./src/models/Session');
// const Event = require('./src/models/Event');

// // Get session ID from command-line argument (e.g., node generateReport.js 68c9771a3c8145993ca86e67)
// const sessionID = process.argv[2];
// if (!sessionID) {
//   console.error('Please provide a session ID as an argument, e.g., node generateReport.js 68c9771a3c8145993ca86e67');
//   process.exit(1);
// }

// mongoose.connect('mongodb://localhost:27017/proctoring', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// async function generateReports(sessionID) {
//   try {
//     const session = await Session.findById(sessionID);
//     if (!session) throw new Error('Session not found');
//     const events = await Event.find({ sessionID });
    
//     const duration = Math.round((session.endTime - session.startTime) / 1000 / 60);
//     let focusLost = 0;
//     let suspicious = 0;
//     events.forEach(e => {
//       if (e.type === 'attention') focusLost++;
//       if (e.type === 'violation') suspicious++;
//     });
    
//     const report = {
//       candidateName: session.candidateName,
//       interviewDuration: `${duration} minutes`,
//       numberOfTimesFocusLost: focusLost,
//       suspiciousEvents: events.map(e => `${e.event} at ${e.time}`),
//       finalIntegrityScore: session.integrityScore || Math.max(100 - (5 * focusLost + 10 * suspicious), 0),
//       videoLink: `http://localhost:5000/videos/${sessionID}`
//     };

//     // Ensure reports directory exists
//     const reportsDir = './reports';
//     if (!fs.existsSync(reportsDir)) {
//       fs.mkdirSync(reportsDir);
//     }

//     // Generate PDF
//     const doc = new PDFDocument();
//     const pdfPath = `${reportsDir}/sample-report-${sessionID}.pdf`;
//     doc.pipe(fs.createWriteStream(pdfPath));
//     doc.fontSize(16).text('Proctoring Report', { align: 'center' });
//     doc.moveDown();
//     doc.fontSize(12).text(`Candidate Name: ${report.candidateName}`);
//     doc.text(`Interview Duration: ${report.interviewDuration}`);
//     doc.text(`Number of Times Focus Lost: ${report.numberOfTimesFocusLost}`);
//     doc.text(`Final Integrity Score: ${report.finalIntegrityScore}`);
//     doc.moveDown();
//     doc.text('Suspicious Events:', { underline: true });
//     report.suspiciousEvents.forEach(event => {
//       doc.text(`- ${event}`);
//     });
//     doc.moveDown();
//     doc.text(`Video Link: ${report.videoLink}`, { link: report.videoLink, underline: true });
//     doc.end();
//     console.log(`PDF generated: ${pdfPath}`);

//     // Generate CSV
//     const csvWriter = createCsvWriter({
//       path: `${reportsDir}/sample-report-${sessionID}.csv`,
//       header: [
//         { id: 'candidateName', title: 'Candidate Name' },
//         { id: 'interviewDuration', title: 'Interview Duration' },
//         { id: 'numberOfTimesFocusLost', title: 'Number of Times Focus Lost' },
//         { id: 'finalIntegrityScore', title: 'Final Integrity Score' },
//         { id: 'suspiciousEvents', title: 'Suspicious Events' },
//         { id: 'videoLink', title: 'Video Link' }
//       ]
//     });
//     await csvWriter.writeRecords([{
//       ...report,
//       suspiciousEvents: report.suspiciousEvents.join('; ')
//     }]);
//     console.log(`CSV generated: ${reportsDir}/sample-report-${sessionID}.csv`);

//     return report;
//   } catch (error) {
//     console.error('Error generating reports:', error);
//   } finally {
//     mongoose.disconnect();
//   }
// }

// // Run for the provided session ID
// generateReports(sessionID);
const mongoose = require('mongoose');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Session = require('./src/models/Session');
const Event = require('./src/models/Event');

const sessionID = process.argv[2];
if (!sessionID) {
  console.error('Please provide a session ID, e.g., node generateReport.js 68c9771a3c8145993ca86e67');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/proctoring', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function generateReports(sessionID) {
  try {
    const session = await Session.findById(sessionID);
    if (!session) throw new Error('Session not found');
    const events = await Event.find({ sessionID });
    
    const duration = Math.round((session.endTime - session.startTime) / 1000 / 60);
    let focusLost = 0;
    let suspicious = 0;
    events.forEach(e => {
      if (e.type === 'attention') focusLost++;
      if (e.type === 'violation') suspicious++;
    });
    
    const report = {
      candidateName: session.candidateName,
      interviewDuration: `${duration} minutes`,
      numberOfTimesFocusLost: focusLost,
      suspiciousEvents: events.map(e => `${e.event} at ${e.time}`),
      finalIntegrityScore: session.integrityScore || Math.max(100 - (5 * focusLost + 10 * suspicious), 0),
      videoLink: session.videoPath || `http://localhost:5000/videos/${sessionID}` // Use cloud URL in production
    };

    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    const doc = new PDFDocument();
    const pdfPath = path.join(reportsDir, `sample-report-${sessionID}.pdf`);
    doc.pipe(fs.createWriteStream(pdfPath));
    doc.fontSize(16).text('Proctoring Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Candidate Name: ${report.candidateName}`);
    doc.text(`Interview Duration: ${report.interviewDuration}`);
    doc.text(`Number of Times Focus Lost: ${report.numberOfTimesFocusLost}`);
    doc.text(`Final Integrity Score: ${report.finalIntegrityScore}`);
    doc.moveDown();
    doc.text('Suspicious Events:', { underline: true });
    report.suspiciousEvents.forEach(event => {
      doc.text(`- ${event}`);
    });
    doc.moveDown();
    doc.text(`Video Link: ${report.videoLink}`, { link: report.videoLink, underline: true });
    doc.end();
    console.log(`PDF generated: ${pdfPath}`);

    const csvWriter = createCsvWriter({
      path: path.join(reportsDir, `sample-report-${sessionID}.csv`),
      header: [
        { id: 'candidateName', title: 'Candidate Name' },
        { id: 'interviewDuration', title: 'Interview Duration' },
        { id: 'numberOfTimesFocusLost', title: 'Number of Times Focus Lost' },
        { id: 'finalIntegrityScore', title: 'Final Integrity Score' },
        { id: 'suspiciousEvents', title: 'Suspicious Events' },
        { id: 'videoLink', title: 'Video Link' }
      ]
    });
    await csvWriter.writeRecords([{
      ...report,
      suspiciousEvents: report.suspiciousEvents.join('; ')
    }]);
    console.log(`CSV generated: ${path.join(reportsDir, `sample-report-${sessionID}.csv`)}`);

    return report;
  } catch (error) {
    console.error('Error generating reports:', error);
  } finally {
    mongoose.disconnect();
  }
}

generateReports(sessionID);