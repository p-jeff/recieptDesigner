const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

// Parse JSON and URL-encoded body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route to handle incoming data from Google Apps Script
app.post('/receive-data', (req, res) => {
  const formData = req.body.data;

  console.log('Received form data:', formData);
  saveAsCSV(formData);

  res.sendStatus(200);
});

// Function to save form data as CSV
function saveAsCSV(data) {
  const headers = ['Question 1', 'Question 2', 'Question 3']; // Replace with your actual question titles
  const csvContent = [headers.join(',')]; // Create CSV header row

  // Add form responses to CSV content
  const csvRows = data.map(row => row.join(','));
  csvContent.push(...csvRows);

  // Write CSV content to file
  fs.writeFile('form_responses.csv', csvContent.join('\n'), err => {
    if (err) {
      console.error('Error saving CSV file:', err);
    } else {
      console.log('CSV file saved successfully');
    }
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
