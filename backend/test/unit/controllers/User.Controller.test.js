import UserController from '../../../src/controllers/User.Controller';
import User from '../../../src/models/User';
import Account from '../../../src/models/Account';
import * as authUtils from '../../../src/utils/auth';
import MESSAGES from '../../../src/messages/messages';

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('../../../src/models/Account');
jest.mock('../../../src/utils/auth');
jest.mock('../../../src/schemas/UserSchema', () => ({
  validateRegisterUser: jest.fn().mockReturnValue({ error: null }),
  validateLoginUser: jest.fn().mockReturnValue({ error: null })
}));

// Mock messages if not available
if (!MESSAGES) {
  const MESSAGES = {
    USERNAME_TAKEN: 'Username is already taken',
    EMAIL_TAKEN: 'Email is already registered',
    USER_NOT_FOUND: 'User not found',
    INVALID_CREDENTIALS: 'Invalid credentials',
    SERVER_ERROR: 'Internal server error',
    VALIDATION_ERROR: 'Validation error'
  };
}

describe('UserController', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      }
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    jest.clearAllMocks();
    
    // Default mock implementations
    User.findOne = jest.fn().mockResolvedValue(null);
    User.create = jest.fn().mockResolvedValue({
      id: 'user-123',
      username: 'testuser',
      email: 'test@example.com'
    });
    
    Account.create = jest.fn().mockResolvedValue({
      id: 'account-456'
    });
    
    authUtils.hashPassword = jest.fn().mockResolvedValue('hashed_password123');
    authUtils.createToken = jest.fn().mockReturnValue('fake-token');
    authUtils.verifyPassword = jest.fn().mockResolvedValue(true);
    authUtils.verifyToken = jest.fn().mockReturnValue({
      userId: 'user-123',
      accountId: 'account-456'
    });
  });
  
  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const expectedToken = 'fake-token';
      
      // Act
      await UserController.register(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledTimes(2);
      expect(authUtils.hashPassword).toHaveBeenCalledWith('password123');
      expect(User.create).toHaveBeenCalledWith({
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password123'
      });
      expect(Account.create).toHaveBeenCalledWith({
        userId: 'user-123'
      });
      expect(authUtils.createToken).toHaveBeenCalledWith('user-123', 'account-456');
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: expectedToken,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com'
        }
      });
    });
    
    it('should return 400 if username is already taken', async () => {
      // Arrange
      User.findOne = jest.fn()
        .mockImplementationOnce(() => ({ id: 'existing-user' })) // Username check
        .mockImplementationOnce(() => null);                  // Email check
      
      // Act
      await UserController.register(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Username is already taken'
      });
      
      // Verify we didn't try to create a new user
      expect(User.create).not.toHaveBeenCalled();
    });
    
    it('should return 400 if email is already registered', async () => {
      // Arrange
      User.findOne = jest.fn()
        .mockImplementationOnce(() => null)                   // Username check
        .mockImplementationOnce(() => ({ id: 'existing-user' })); // Email check
      
      // Act
      await UserController.register(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Email is already registered'
      });
      
      // Verify we didn't try to create a new user
      expect(User.create).not.toHaveBeenCalled();
    });
    
    it('should return 400 if validation fails', async () => {
      // Arrange
      const UserSchema = require('../../../src/schemas/UserSchema');
      UserSchema.validateRegisterUser.mockReturnValueOnce({
        error: { message: 'Validation failed' }
      });
      
      // Act
      await UserController.register(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed'
      });
      
      // Verify we didn't check for existing users or try to create a new one
      expect(User.findOne).not.toHaveBeenCalled();
      expect(User.create).not.toHaveBeenCalled();
    });
    
    it('should return 500 if an error occurs during user creation', async () => {
      // Arrange
      User.create = jest.fn().mockRejectedValue(new Error('Database error'));
      
      // Act
      await UserController.register(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
  
  describe('login', () => {
    beforeEach(() => {
      // Setup mock for a valid user
      User.findOne = jest.fn().mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashed_password123',
        accountId: 'account-456'
      });
    });
    
    it('should login a user successfully with username', async () => {
      // Arrange
      req.body = {
        username: 'testuser',
        password: 'password123'
      };
      const expectedToken = 'fake-token';
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { username: 'testuser' } });
      expect(authUtils.verifyPassword).toHaveBeenCalledWith('hashed_password123', 'password123');
      expect(authUtils.createToken).toHaveBeenCalledWith('user-123', 'account-456');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        token: expectedToken,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com'
        }
      });
    });
    
    it('should login a user successfully with email', async () => {
      // Arrange
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(authUtils.verifyPassword).toHaveBeenCalled();
      expect(authUtils.createToken).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
    
    it('should return 400 if validation fails', async () => {
      // Arrange
      const UserSchema = require('../../../src/schemas/UserSchema');
      UserSchema.validateLoginUser.mockReturnValueOnce({
        error: { message: 'Validation failed' }
      });
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed'
      });
      
      // Verify we didn't try to find a user or verify password
      expect(User.findOne).not.toHaveBeenCalled();
      expect(authUtils.verifyPassword).not.toHaveBeenCalled();
    });
    
    it('should return 404 if user is not found', async () => {
      // Arrange
      User.findOne = jest.fn().mockResolvedValue(null);
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found'
      });
      
      // Verify we didn't try to verify password
      expect(authUtils.verifyPassword).not.toHaveBeenCalled();
    });
    
    it('should return 401 if password is incorrect', async () => {
      // Arrange
      authUtils.verifyPassword = jest.fn().mockResolvedValue(false);
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid credentials'
      });
      
      // Verify we didn't try to create a token
      expect(authUtils.createToken).not.toHaveBeenCalled();
    });
    
    it('should return 500 if an error occurs during login', async () => {
      // Arrange
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
      
      // Act
      await UserController.login(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
  
  describe('verify', () => {
    beforeEach(() => {
      req.headers = {
        authorization: 'Bearer fake-token'
      };
      
      User.findOne = jest.fn().mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com'
      });
    });
    
    it('should return user data for a valid token', async () => {
      // Act
      await UserController.verify(req, res);
      
      // Assert
      expect(authUtils.verifyToken).toHaveBeenCalledWith('fake-token');
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 'user-123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com'
        }
      });
    });
    
    it('should return 500 if an error occurs during verification', async () => {
      // Arrange
      User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));
      
      // Act
      await UserController.verify(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error'
      });
    });
  });
});