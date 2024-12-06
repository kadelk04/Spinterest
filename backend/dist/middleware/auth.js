var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getModel } from '../utils/connection';
//const User = mongoose.model<IUser & mongoose.Document>('User', UserSchema);
export function registerUser(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    const { username, password } = req.body; // from form
    console.log('in regiserUser');
    const User = getModel('User');
    console.log(req.body);
    if (!username || !password) {
      res.status(400).send('Bad request: Invalid input data.');
    } else {
      console.log('in registerUser');
      // Check if the username already exists
      const existingUser = yield User.findOne({ username });
      if (existingUser) {
        res.status(400).json({ error: 'Username already taken' });
        return;
      } else {
        console.log('gonna bcrypt');
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
    }
  });
}
function generateAccessToken(username) {
  const secret = process.env.TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      'TOKEN_SECRET is not defined in the environment variables.'
    );
  }
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username },
      secret, // Use the environment variable
      { expiresIn: '1d' },
      (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(token);
          console.log('in hereeee');
        }
      }
    );
  });
}
export function loginUser(req, res) {
  return __awaiter(this, void 0, void 0, function* () {
    const { username, password } = req.body; // from form
    const User = getModel('User');
    console.log(req.body);
    console.log('i wanna log in');
    if (!username || !password) {
      res.status(400).send('Bad request: Invalid input data.');
      return;
    }
    try {
      // Find user by username and include the password field explicitly
      const user = yield User.findOne({ username }).select('+password');
      console.log('User:', user);
      if (!user) {
        res.status(400).send('Invalid username or password.');
        return;
      }
      // Compare the provided password with the hashed password in the database
      const isPasswordValid = yield bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);
      if (!isPasswordValid) {
        res.status(400).send('Invalid username or password.');
        return;
      }
      // Generate an access token
      const token = yield generateAccessToken(user.username);
      // Send the token as the response
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal server error.');
    }
  });
}
export function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Getting the 2nd part of the auth header (the token)
  const token = authHeader;
  console.log('Auth header:', token);
  if (!token) {
    console.log('No token received');
    res.status(401).end();
  } else {
    jwt.verify(token, process.env.TOKEN_SECRET, (error, decoded) => {
      if (decoded) {
        next();
      } else {
        console.log('JWT error:', error);
        res.status(401).end();
      }
    });
  }
}
