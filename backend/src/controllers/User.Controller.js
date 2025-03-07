import userSchema from "../schemas/UserSchema.js";
import argon2 from 'argon2';
import auth from '../utils/auth.js';
import MESSAGES from "../messages/messages.js";

export default class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    const result = userSchema.validateRegisterUser(req.body);
    console.log(result);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    const existingUser = await this.userModel.findOne({
      where: {
        email: result.data.email,
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: MESSAGES.EMAIL_ALREADY_EXISTS });
    }

    try {
      result.data.password = await argon2.hash(result.data.password);
      const newUser = await this.userModel.create(result.data);
      return res.status(201).send(newUser);
    }
    catch (error) {
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }

  login = async (req, res) => {
    const result = userSchema.validateLoginUser(req.body);

    if (!result.success) {
      return res.status(400).json({ error: MESSAGES.INVALID_DATA });
    }

    try {
      const user = await this.userModel.findOne({
        where: { email: result.data.email, }
      });

      if (!user) {
        return res.status(401).json({ error: MESSAGES.INVALID_CREDENTIALS });
      }

      const isPasswordValid = await argon2.verify(user.password, result.data.password);

      if (!isPasswordValid) {
        return res.status(401).json({ error: MESSAGES.INVALID_CREDENTIALS });
      }

      const token = auth.createToken(user);

      const { password, id, ...userData } = user.dataValues;

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

      const user = await this.userModel.findByPk(decoded.id);
      if (!user) {
        console.error('User not found with id:', decoded.id);
        return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
      }

      const hashedPassword = await argon2.hash(result.data.newPassword);

      await user.update({ password: hashedPassword });

      return res.status(200).send();
    }
    catch (error) {
      console.error('Change password error:', error);
      return res.status(500).json({ error: MESSAGES.ERROR_500 });
    }
  }
}