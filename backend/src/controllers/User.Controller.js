import userSchema from "../schemas/UserSchema.js";
import argon2 from 'argon2';
import auth from '../utils/auth.js';
import MESSAGES from "../messages/messages.js";
import userModel from "../models/User.js";
import accountModel from "../models/Account.js";

export default class UserController {

  register = async (req, res) => {
    const result = userSchema.validateRegisterUser(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    const existingAccount = await accountModel.findOne({
      where: { email: result.data.email }
    });

    if (existingAccount) {
      return res.status(409).json({ error: MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    try {
      const hashedPassword = await argon2.hash(result.data.password);

      const newAccount = await accountModel.create({
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword
      });

      await userModel.create({
        id: newAccount.id
      });

      const responseData = {
        username: newAccount.username,
        email: newAccount.email
      };

      return res.status(201).send(responseData);
    }
    catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  login = async (req, res) => {
    const result = userSchema.validateLoginUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const account = await accountModel.findOne({
        where: { email: result.data.email }
      });

      if (!account) {
        return res.status(401).json({ error: MESSAGES.INVALID_CREDENTIALS });
      }

      const isPasswordValid = await argon2.verify(account.password, result.data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: MESSAGES.INVALID_CREDENTIALS });
      }

      const token = auth.createToken({ id: account.id });

      const userData = {
        username: account.username,
        email: account.email
      };

      return res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      }).json({ message: MESSAGES.LOGIN_SUCCESS, user: userData });
    }
    catch (error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  logout = async (req, res) => {
    return res.status(200).clearCookie('token').json({ message: MESSAGES.LOGOUT_SUCCESS });
  }

  changePassword = async (req, res) => {
    const result = userSchema.validateChangePassword(req.body);

    if (!result.success) {
      console.error('Validation error:', result.error);
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const token = req.cookies.token;
      if (!token) {
        console.error('No token found in cookies');
        return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
      }

      const decoded = auth.verifyToken(token);
      const account = await accountModel.findByPk(decoded.id);

      if (!account) {
        console.error('Account not found for accountId:', decoded.id);
        return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
      }

      const hashedPassword = await argon2.hash(result.data.newPassword);

      await account.update({ password: hashedPassword });

      return res.status(200).json({ message: 'Password changed successfully' });
    }
    catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }
}