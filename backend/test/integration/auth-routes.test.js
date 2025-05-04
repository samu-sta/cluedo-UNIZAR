/*************************************************
 * Test de integración para rutas de autenticación
 * 
 * Este test verifica la integración correcta
 * entre las rutas de autenticación, controladores y
 * modelos, validando el registro, login y gestión 
 * de usuarios en el sistema.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { connect, disconnect } = require('../db');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await disconnect();
});

describe('Auth Routes', () => {
  let token;

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('should get the logged in user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
  });
});