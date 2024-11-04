import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import routes from './routes/index';

const app = express();

const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Extend the Request interface to include a dbConnection property
declare module 'express-serve-static-core' {
  interface Request {
    dbConnection?: mongoose.Connection;
  }
}

app.use('/api', routes);

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
