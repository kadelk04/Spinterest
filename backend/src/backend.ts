import express from 'express';
import cors from 'cors';
import { getDbConnection } from './utils/connection';
import routes from './routes/index.js';
import { config } from 'dotenv';

config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize DB and start server
const startServer = async () => {
  await getDbConnection();

  // Routes
  app.use('/api', routes);

  // Basic route
  app.get('/', (req, res) => {
    res.send('Hello, World!');
  });

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
  });
};

startServer();
