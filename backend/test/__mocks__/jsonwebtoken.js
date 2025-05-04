// Mock para el módulo jsonwebtoken
module.exports = {
  sign: jest.fn((payload, secret, options) => {
    return 'fake-jwt-token';
  }),
  
  verify: jest.fn((token, secret) => {
    if (token === 'invalid-token') {
      throw new Error('Invalid token');
    }
    
    return { id: 'user-id' };
  })
};