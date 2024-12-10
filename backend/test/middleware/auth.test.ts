import request from 'supertest';
import express from 'express';
import { getModel } from '../../src/utils/connection';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  authenticateUser,
  loginUser,
  registerUser,
} from '../../src/middleware/auth';

const app = express();
app.use(express.json());
app.post('/user', registerUser);
app.post('/login', loginUser);
app.get('/protected-route', authenticateUser, (req, res) => {
  res.status(200).send('Protected route');
});
jest.mock('../../src/utils/connection');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let User: any;

  beforeAll(() => {
    process.env.TOKEN_SECRET = 'testsecret';
  });

  beforeEach(() => {
    User = {
      findOne: jest.fn().mockReturnThis(),
      create: jest.fn(),
      select: jest.fn(),
    };
    (getModel as jest.Mock).mockReturnValue(User);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should return 400 if username already exists', async () => {
      User.findOne.mockResolvedValue({ username: 'existingUser' });

      const response = await request(app)
        .post('/user')
        .send({ username: 'existingUser', password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already taken');
    });

    it('should return 201 and token if registration is successful', async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({});
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (jwt.sign as jest.Mock).mockImplementation(
        (payload, secret, options, callback) => {
          callback(null, 'token');
        }
      );

      const response = await request(app)
        .post('/user')
        .send({ username: 'newUser', password: 'password123' });

      expect(response.status).toBe(201);
      expect(response.body.token).toBe('token');
    });

    it('should return 500 if there is an error during registration', async () => {
      User.findOne.mockResolvedValue(null);
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(
        new Error('bcrypt error')
      );

      const response = await request(app)
        .post('/user')
        .send({ username: 'newUser', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.text).toBe('Internal server error');
    });
  });

  describe('loginUser', () => {
    it('should return 400 if username is missing', async () => {
      const response = await request(app).post('/login').send({ username: '' });

      expect(response.status).toBe(400);
      expect(response.text).toBe('Bad request: Invalid input data.');
    });

    it('should return 401 if user does not exist', async () => {
      User.findOne.mockReturnThis(null);
      User.select.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send({ username: 'nonexistentUser', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password');
    });

    it('should return 401 if username or password is invalid', async () => {
      User.findOne.mockReturnThis();
      User.select.mockResolvedValue({
        username: 'nonexistentUser',
        password: 'password123',
      });

      const response = await request(app)
        .post('/login')
        .send({ username: 'nonexistentUser', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid username or password.');
    });

    it('should return 200 and token if login is successful', async () => {
      User.findOne.mockReturnThis();
      User.select.mockResolvedValue({
        username: 'existingUser',
        password: 'hashedPassword',
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation(
        (payload, secret, options, callback) => {
          callback(null, 'token');
        }
      );

      const response = await request(app)
        .post('/login')
        .send({ username: 'existingUser', password: 'password123' });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe('token');
    });

    it('should return 500 if there is an error during login', async () => {
      User.findOne.mockImplementation(() => {
        throw new Error('database error');
      });

      const response = await request(app)
        .post('/login')
        .send({ username: 'existingUser', password: 'password123' });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe('Internal server error');
    });
  });

  describe('authenticateUser', () => {
    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/protected-route');

      expect(response.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (token, secret, callback) => {
          callback(new Error('invalid token'), null);
        }
      );

      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'invalidToken');

      expect(response.status).toBe(401);
    });

    it('should call next if token is valid', async () => {
      (jwt.verify as jest.Mock).mockImplementation(
        (
          token: string,
          secret: string,
          callback: (err: Error | null, decoded: object | null) => void
        ) => {
          callback(null, { username: 'validUser' });
        }
      );

      app.get('/protected-route', authenticateUser, (req, res) => {
        res.status(200).end();
      });

      const response = await request(app)
        .get('/protected-route')
        .set('Authorization', 'validToken');

      expect(response.status).toBe(200);
    });
  });
});
