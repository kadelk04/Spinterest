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
import { getModel } from '../utils/connection';
/**
 * Retrieve a user by their username
 * @param req
 * @param res
 * @returns
 */
export const getUserByUsername = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.username) {
        res.status(400).send('Invalid request');
        return;
      }
      const UserModel = getModel('User');
      const user = yield UserModel.findOne({ username: req.params.username });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      res.status(200).send(user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching user');
    }
  });
/**
 * Update any field of a user by their username
 * @param req
 * @param res
 * @returns
 */
export const updateUserByUsername = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.username || !req.body) {
        res.status(400).send('Invalid request');
        return;
      }
      const UserModel = getModel('User');
      const user = yield UserModel.findOne({ username: req.params.username });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      try {
        yield user.updateOne(req.body);
        res.status(200).send('User updated');
      } catch (err) {
        res.status(500).send('Error updating user: ' + err);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error updating user');
    }
  });
/**
 * Delete a user by their username
 * @param req
 * @param res
 * @returns
 */
export const deleteUserByUsername = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.params.username) {
        res.status(400).send('Invalid request');
        return;
      }
      const UserModel = getModel('User');
      const user = yield UserModel.findOne({ username: req.params.username });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }
      try {
        yield user.deleteOne();
        res.status(200).send('User deleted');
      } catch (err) {
        res.status(500).send('Error deleting user: ' + err);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error deleting user');
    }
  });
/**
 * Create a new user with the given username and password
 * @param req: the request object containing the username and password
 * @param res
 * @returns
 */
export const addUser = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      if (!req.body.username || !req.body.password) {
        res.status(400).send('Invalid request');
      }
      const UserModel = getModel('User');
      const user = new UserModel(req.body);
      try {
        yield user.save();
        res.status(201).send('User created');
      } catch (err) {
        res.status(500).send('Error creating user: ' + err);
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error creating user');
    }
  });
/**
 * Retrieve all users
 * @param req
 * @param res
 * @returns
 */
export const getAllUsers = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const UserModel = getModel('User');
      const users = yield UserModel.find({});
      res.status(200).send(users);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching users');
    }
  });
