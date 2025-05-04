/*************************************************
 * Test simple para verificación del entorno
 * 
 * Este test sirve como prueba básica para comprobar
 * que el entorno de testing está configurado
 * correctamente y funciona según lo esperado.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

// Simple test para verificar que Jest funciona
// Adding explicit imports for Jest test functions in ES modules environment
import { describe, test, expect } from '@jest/globals';

describe('Basic Jest functionality', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(1 + 2).toBe(3);
  });
});