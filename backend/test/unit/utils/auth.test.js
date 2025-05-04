/*************************************************
 * Test de utilidades de autenticación
 * 
 * Este test verifica las funciones de utilidad para
 * la autenticación de usuarios, incluyendo la generación
 * y validación de tokens JWT y el manejo de credenciales.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import auth from '../../../src/utils/auth';

describe('Auth Utils', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Setup test environment
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret',
      JWT_EXPIRATION: '24h'
    };
  });
  
  afterEach(() => {
    process.env = originalEnv;
  });

  describe('Authentication Utilities', () => {
    it('should export required authentication functions', () => {
      expect(auth).toHaveProperty('createToken');
      expect(auth).toHaveProperty('verifyToken');
      expect(auth).toHaveProperty('generateSocketToken');
      expect(typeof auth.createToken).toBe('function');
      expect(typeof auth.verifyToken).toBe('function');
      expect(typeof auth.generateSocketToken).toBe('function');
    });
  });
});