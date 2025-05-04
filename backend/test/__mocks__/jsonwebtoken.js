/*************************************************
 * Test de integración para mock de jsonwebtoken
 * 
 * Este mock simula las funciones de firma y verificación
 * de JSON Web Tokens para permitir pruebas sin 
 * depender de claves de cifrado reales.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

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