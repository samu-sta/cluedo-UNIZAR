/*************************************************
 * AUTH MIDDLEWARE
 * 
 * 
 * This middleware checks if the user is authenticated by verifying the JWT token.
 * 
 * Autor: SAMUEL FELIPE
 *************************************************/
import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';
import AccountModel from '../models/Account.js';
export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
    }

    const decoded = auth.verifyToken(token);
    const account = await AccountModel.findByPk(decoded.id);

    if (!account) {
      return res.status(404).json({ error: MESSAGES.USER_NOT_FOUND });
    }

    req.account = account;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
  }
};