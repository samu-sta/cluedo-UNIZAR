/*************************************************
 * Test de integración para mock de argon2
 * 
 * Este mock simula las funciones de hash y verificación
 * de contraseñas del módulo argon2, permitiendo probar
 * la autenticación sin depender de la librería real.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

// Mock para el módulo argon2
module.exports = {
  hash: jest.fn(async (password) => {
    return `hashed_${password}`;
  }),
  
  verify: jest.fn(async (hash, plain) => {
    if (plain === 'wrong_password') {
      return false;
    }
    return true;
  })
};