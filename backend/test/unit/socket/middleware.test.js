/*************************************************
 * Test del middleware de socket.io
 * 
 * Este test verifica la funcionalidad del middleware
 * usado para autenticar y validar conexiones socket.io,
 * incluyendo la validación de tokens y gestión de sesiones.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import { jest } from '@jest/globals';

// Mock JWT
const decodedToken = {
  userId: 'user123',
  gameId: 'game123',
  username: 'testuser'
};

// Mock de jsonwebtoken para ES Modules
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(() => decodedToken)
}));

// Import después del mock
import { socketAuthMiddleware } from '../../../src/socket/middleware.js';

describe('Socket Auth Middleware', () => {
  let mockSocket;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSocket = {
      handshake: {
        auth: {
          token: 'valid-token'
        }
      },
      disconnect: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should authenticate with a valid token and set socket properties', () => {
    // Arrange - uso del mock global
    const jwt = require('jsonwebtoken');
    
    // Act
    socketAuthMiddleware(mockSocket, mockNext);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalled();
    expect(mockSocket.userId).toBe('user123');
    expect(mockSocket.gameId).toBe('game123');
    expect(mockSocket.username).toBe('testuser');
    expect(mockSocket.disconnect).not.toHaveBeenCalled();
  });

  it('should pass an error when token is invalid', () => {
    // Arrange
    const jwt = require('jsonwebtoken');
    jwt.verify.mockImplementationOnce(() => {
      throw new Error('Invalid token');
    });
    
    // Act
    socketAuthMiddleware(mockSocket, mockNext);
    
    // Assert
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
  
  it('should pass an error when token is missing', () => {
    // Arrange
    mockSocket.handshake.auth = {}; // No token provided
    
    // Act
    socketAuthMiddleware(mockSocket, mockNext);
    
    // Assert
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});