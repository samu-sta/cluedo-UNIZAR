import auth from '../utils/auth.js';
import MESSAGES from '../messages/messages.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
    }

    const decoded = auth.verifyToken(token);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ error: MESSAGES.UNAUTHORIZED });
  }
};