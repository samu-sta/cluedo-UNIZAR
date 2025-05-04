import request from 'supertest';
import { createApp } from '../../src/app/app.js';
import { jest } from '@jest/globals';

// Mock models and dependencies
jest.mock('../../src/models/Account.js', () => ({
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}));

import AccountModel from '../../src/models/Account.js';

describe('Authentication API Integration Tests', () => {
  let app;
  let server;

  beforeAll(async () => {
    app = await createApp(true);
    server = app.listen(0);
  });

  afterAll(async () => {
    await new Promise(resolve => server.close(resolve));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    test('should register a new user successfully', async () => {
      // Mock the database calls
      AccountModel.findOne.mockResolvedValue(null); // No existing user
      AccountModel.create.mockResolvedValue({
        username: 'newuser',
        email: 'new@example.com'
      });
      
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('username', 'newuser');
    });
    
    test('should return 409 when username already exists', async () => {
      // Mock the database calls
      AccountModel.findOne.mockResolvedValueOnce({
        username: 'existinguser',
        email: 'existing@example.com'
      });
      
      const response = await request(app)
        .post('/api/users/register')
        .send({
          username: 'existinguser',
          email: 'new@example.com',
          password: 'password123'
        });
      
      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Register a user for login tests
      AccountModel.findOne.mockResolvedValue(null); // No existing user
      AccountModel.create.mockResolvedValue({
        username: 'loginuser',
        email: 'login@example.com'
      });
      
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'password123'
        });
      
      jest.clearAllMocks();
    });

    test('should login successfully with valid credentials', async () => {
      // Mock the database and password verification calls
      AccountModel.findOne.mockResolvedValue({
        id: 'user1',
        username: 'loginuser',
        email: 'login@example.com',
        password: 'hashedpassword' // In a real scenario this would be hashed
      });
      
      // Mock argon2 verification (this is normally auto-mocked in Jest)
      jest.mock('argon2', () => ({
        verify: jest.fn().mockResolvedValue(true)
      }));
      
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'loginuser',
          password: 'password123'
        });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });
    
    test('should return 401 with invalid credentials', async () => {
      // Mock the database call to return a user
      AccountModel.findOne.mockResolvedValue({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'hashedpassword'
      });
      
      // Mock argon2 verification to fail
      jest.mock('argon2', () => ({
        verify: jest.fn().mockResolvedValue(false)
      }));
      
      const response = await request(app)
        .post('/api/users/login')
        .send({
          username: 'loginuser',
          password: 'wrongpassword'
        });
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('Protected Routes', () => {
    let authToken;
    
    beforeEach(async () => {
      // Create a user and get token
      AccountModel.findOne.mockResolvedValue(null); // No existing user for registration
      AccountModel.create.mockResolvedValue({
        id: 'user2',
        username: 'protecteduser',
        email: 'protected@example.com'
      });
      
      // Mock argon2 verification for login
      jest.mock('argon2', () => ({
        verify: jest.fn().mockResolvedValue(true)
      }));
      
      // Register user
      await request(app)
        .post('/api/users/register')
        .send({
          username: 'protecteduser',
          email: 'protected@example.com',
          password: 'password123'
        });
      
      // Mock the login lookup
      AccountModel.findOne.mockResolvedValue({
        id: 'user2',
        username: 'protecteduser',
        email: 'protected@example.com',
        password: 'hashedpassword'
      });
      
      // Login to get token
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          username: 'protecteduser',
          password: 'password123'
        });
      
      authToken = loginResponse.body.token;
      
      jest.clearAllMocks();
    });

    test('should access protected route with valid token', async () => {
      // Mock the account lookup for auth middleware
      AccountModel.findOne.mockResolvedValue({
        id: 'user2',
        username: 'protecteduser',
        email: 'protected@example.com'
      });
      
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
    
    test('should return 401 when accessing protected route without token', async () => {
      const response = await request(app)
        .get('/api/users/profile');
      
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});