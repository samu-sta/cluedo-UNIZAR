/*************************************************
 * Test del middleware de autenticación
 * 
 * Este test verifica que el middleware de autenticación
 * funcione correctamente, validando tokens JWT y
 * rechazando peticiones no autorizadas.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest, describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { authMiddleware } from '../../../src/middlewares/auth.js';

// Creamos mock personalizado para auth y Account
jest.mock('../../../src/utils/auth.js', () => ({
  __esModule: true,
  default: {
    verifyToken: jest.fn().mockReturnValue({ id: 123 })
  }
}));

jest.mock('../../../src/models/Account.js', () => ({
  __esModule: true,
  default: {
    findByPk: jest.fn().mockResolvedValue({
      id: 123,
      username: 'testuser',
      email: 'test@example.com'
    })
  }
}));

// Importamos los mocks usando sintaxis de ES Modules
import auth from '../../../src/utils/auth.js';
import AccountModel from '../../../src/models/Account.js';

describe('Auth Middleware', () => {
  let req, res, next;
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup request, response, and next function mocks
    req = {
      cookies: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: jest.fn()
    };
    next = jest.fn();
    
    // Set test environment
    process.env.NODE_ENV = 'test';
  });
  
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  test('should call next() when a valid token is provided', async () => {
    // Setup request with token
    req.cookies.token = 'jwt-token-123';

    // Execute
    await authMiddleware(req, res, next);

    // Verify
    expect(auth.verifyToken).toHaveBeenCalledWith('jwt-token-123');
    expect(next).toHaveBeenCalled();
    expect(req.account).toEqual(expect.objectContaining({
      id: 123
    }));
  });
  
  test('should handle token in Authorization header', async () => {
    // Setup request with Bearer token
    req.headers.authorization = 'Bearer jwt-token-456';

    // Execute
    await authMiddleware(req, res, next);

    // Verify
    expect(auth.verifyToken).toHaveBeenCalledWith('jwt-token-456');
    expect(next).toHaveBeenCalled();
  });

  test('should return 401 when no token is provided', async () => {
    // Execute
    await authMiddleware(req, res, next);

    // Verify
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }));
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 401 when token verification fails', async () => {
    // Setup request with token
    req.cookies.token = 'invalid-token';

    // Mock auth.verifyToken para este test específico
    auth.verifyToken.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });

    // Execute
    await authMiddleware(req, res, next);

    // Verify
    expect(auth.verifyToken).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.any(String)
    }));
    expect(next).not.toHaveBeenCalled();
  });
});