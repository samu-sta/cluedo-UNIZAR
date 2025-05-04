/*************************************************
 * Test de mensajes del sistema
 * 
 * Este test verifica que todos los mensajes del sistema
 * estén correctamente definidos y sean accesibles,
 * incluyendo mensajes de error y éxito.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import MESSAGES from '../../../src/messages/messages.js';

describe('Messages Module', () => {
  it('should export an object with message constants', () => {
    expect(MESSAGES).toBeDefined();
    expect(typeof MESSAGES).toBe('object');
  });

  it('should contain error messages for authentication', () => {
    expect(MESSAGES.UNAUTHORIZED).toBeDefined();
    expect(MESSAGES.INVALID_CREDENTIALS).toBeDefined();
    expect(MESSAGES.USER_NOT_FOUND).toBeDefined();
    expect(MESSAGES.EMAIL_ALREADY_EXISTS).toBeDefined();
  });

  it('should contain error messages for game operations', () => {
    expect(MESSAGES.GAME_NOT_FOUND).toBeDefined();
    expect(MESSAGES.GAME_ALREADY_STARTED).toBeDefined();
  });

  it('should contain generic error messages', () => {
    expect(MESSAGES.ERROR_500).toBeDefined();
    expect(MESSAGES.INVALID_DATA).toBeDefined();
  });

  it('should have properly formatted string values', () => {
    // Check that messages are strings and not empty
    Object.values(MESSAGES).forEach(message => {
      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });
  });
});