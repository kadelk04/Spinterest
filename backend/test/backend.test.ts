import request from 'supertest';
import express from 'express';
import cors from 'cors';
import routes from '../src/routes/index';
import { getDbConnection } from '../src/utils/connection';
import dotenv from 'dotenv';

jest.mock('../src/utils/connection');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', routes);

(getDbConnection as jest.Mock).mockImplementation(() => {
  console.log('Mocked DB connection');
});

describe('Route Tests', () => {
  beforeAll(async () => {
    await getDbConnection();
  });

  it('should respond with 200 on GET /api', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
  });

  it('should respond with 404 on unknown route', async () => {
    const response = await request(app).get('/unknown-route');
    expect(response.status).toBe(404);
  });
});
