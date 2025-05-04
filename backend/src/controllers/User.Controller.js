import userSchema from "../schemas/UserSchema.js";
import argon2 from 'argon2';
import auth from '../utils/auth.js';
import MESSAGES from "../messages/messages.js";
import userModel from "../models/User.js";
import accountModel from "../models/Account.js";

export default class UserController {
  constructor() {
    this.userModel = userModel;
    this.accountModel = accountModel;
  }

  register = async (req, res) => {
    const result = userSchema.validateRegisterUser(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, error: MESSAGES.INVALID_DATA });
    }

    const existingAccount = await this.accountModel.findOne({
      where: { email: result.data.email }
    });

    if (existingAccount) {
      return res.status(409).json({ success: false, error: MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    try {
      const hashedPassword = await argon2.hash(result.data.password);

      const newAccount = await this.accountModel.create({
        username: result.data.username,
        email: result.data.email,
        password: hashedPassword
      });

      await this.userModel.create({
        id: newAccount.id
      });

      return res.status(201).send({ success: true });
    }
    catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ success: false, error: MESSAGES.ERROR_500 });
    }
  }

  login = async (req, res) => {
    const result = userSchema.validateLoginUser(req.body);

    if (!result.success) {
      return res.status(400).json({ success: false, error: MESSAGES.INVALID_DATA });
    }

    try {
      const account = await this.accountModel.findOne({
        where: { email: result.data.email }
      });

      if (!account) {
        return res.status(401).json({ success: false, error: MESSAGES.INVALID_CREDENTIALS });
      }

      const isPasswordValid = await argon2.verify(account.password, result.data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ success: false, error: MESSAGES.INVALID_CREDENTIALS });
      }

      const token = auth.createToken({ id: account.id });

      const userData = {
        id: account.id,
        username: account.username,
        email: account.email
      };

      return res.status(200).cookie('token', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none'
      }).json({ success: true, user: userData });
    }
    catch (error) {
      return res.status(500).json({ success: false, error: MESSAGES.ERROR_500 });
    }
  }

  logout = async (req, res) => {
    return res.status(200).clearCookie('token').json({ success: true });
  }

  changePassword = async (req, res) => {
    const result = userSchema.validateChangePassword(req.body);

    if (!result.success) {
      console.error('Validation error:', result.error);
      return res.status(400).json({ success: false, error: MESSAGES.INVALID_DATA });
    }

    try {
      const token = req.cookies.token;
      if (!token) {
        console.error('No token found in cookies');
        return res.status(401).json({ success: false, error: MESSAGES.UNAUTHORIZED });
      }

      const decoded = auth.verifyToken(token);
      const account = await this.accountModel.findByPk(decoded.id);

      if (!account) {
        console.error('Account not found for accountId:', decoded.id);
        return res.status(404).json({ success: false, error: MESSAGES.USER_NOT_FOUND });
      }

      const hashedPassword = await argon2.hash(result.data.newPassword);

      await account.update({ password: hashedPassword });

      return res.status(200).json({ success: true });
    }
    catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ success: false, error: MESSAGES.ERROR_500 });
    }
  }
}