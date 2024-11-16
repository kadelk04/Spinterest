import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getModel } from '../utils/connection';
import { IUser, UserSchema } from '../models/User';
import { model } from 'mongoose';

export function registerUser(req: Request, res: Response): void {
  const { username, password } = req.body; // from form
  const User = getModel<IUser>('User');
  console.log(req.body);
  if (!username || !password) {
    res.status(400).send('Bad request: Invalid input data.');
  } else {
    User.findOne({ username }).then((existingUser) => {
      if (existingUser) {
        res.status(409).send('Username already taken');
      } else {
        bcrypt
          .genSalt(10)
          .then((salt) => bcrypt.hash(password, salt))
          .then((hashedPassword) => {
            const newUser = new User({ username, password: hashedPassword });
            newUser.save().then(() => {
              generateAccessToken(username).then((token) => {
                console.log('Token:', token);
                res.status(201).send({ token: token });
              });
            });
          })
          .catch((error) => {
            console.error('Error during registration:', error);
            res.status(500).send('Internal server error');
          });
      }
    });
  }
}

function generateAccessToken(username: string): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username },
      process.env.TOKEN_SECRET!,
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token as string);
        }
      }
    );
  });
}

export function loginUser(req: Request, res: Response): void {
  const { username, password } = req.body; // from form
  const User = getModel<IUser>('User');
  console.log(req.body);

  if (!username || !password) {
    res.status(400).send('Bad request: Invalid input data.');
  } else {
    User.findOne({ username })
      .select('+password')
      .then((user) => {
        if (!user) {
          res.status(404).send('User not found');
        } else {
          bcrypt
            .compare(password, user.password)
            .then((result) => {
              if (result) {
                generateAccessToken(username).then((token) => {
                  console.log('Token:', token);
                  res.status(200).send({ token: token });
                });
              } else {
                res.status(401).send('Invalid password');
              }
            })
            .catch((error) => {
              console.error('Error during login:', error);
              res.status(500).send('Internal server error');
            });
        }
      });
  }
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  // Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token received');
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET!, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log('JWT error:', error);
        res.status(401).end();
      }
    });
  }
}
