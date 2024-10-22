import express from 'express';
import mongoose from 'mongoose';
const cors = require('cors');

const app = express();
const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

