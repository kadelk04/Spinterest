import express from 'express';
import bodyParser from 'body-parser';
const app = express();
const port = 5000;
// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.post('/api/logProfileInput', (req, res) => {
  const { type, value } = req.body;
  if (type === 'status') {
    console.log(`Received Status: ${value}`);
  } else {
    console.log('Unknown type received:', type);
  }
  res.json({ message: 'Data received and logged successfully' });
});
// Start the server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
