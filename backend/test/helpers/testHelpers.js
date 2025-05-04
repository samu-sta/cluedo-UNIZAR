// Utilidades comunes para todos los tests
import { jest } from '@jest/globals';

/**
 * Crea un mock para los objetos req de Express
 * @returns {Object} Objeto request mockeado
 */
export const mockRequest = () => {
  const req = {};
  req.body = {};
  req.query = {};
  req.params = {};
  req.headers = {};
  return req;
};

/**
 * Crea un mock para los objetos res de Express
 * @returns {Object} Objeto response mockeado con funciones jest
 */
export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Función mock para next de Express
 */
export const mockNext = jest.fn();

/**
 * Espera un tiempo especificado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} - Promesa que se resuelve después del tiempo
 */
export const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));