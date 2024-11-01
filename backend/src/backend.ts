import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';

const app = express();

const port = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Extend the Request interface to include a dbConnection property
declare module 'express-serve-static-core' {
  interface Request {
    dbConnection?: mongoose.Connection;
  }
}

app.use('/api/user', require('./controllers/UserController'));
app.use('/api/login', require('./controllers/LoginController'));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
