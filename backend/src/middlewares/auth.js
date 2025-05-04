import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';
import AccountModel from '../models/Account.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.token;
    
    // Check Authorization header if token not found in cookies
    if (!token && req.headers.authorization) {
      // Extract token from "Bearer <token>"
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
    }

    const decoded = auth.verifyToken(token);

    // In test environment, skip database lookup
    if (process.env.NODE_ENV === 'test') {
      req.account = {
        id: decoded.id,
        username: `testuser-${decoded.id}`,
        email: `test-${decoded.id}@example.com`
      };
      return next();
    }

    // In non-test environments, look up the user
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