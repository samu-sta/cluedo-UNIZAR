/*************************************************
 * Test de integración para rutas de usuario
 * 
 * Este test verifica la correcta integración entre
 * las rutas de usuario, controladores y modelos,
 * validando el registro, gestión de perfiles y
 * actualización de datos de usuarios.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

describe('User Routes', () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123'
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/users')
      .send({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('Jane Doe');
  });

  it('should get a user by id', async () => {
    const res = await request(app).get(`/users/${user._id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('John Doe');
  });

  it('should update a user by id', async () => {
    const res = await request(app)
      .put(`/users/${user._id}`)
      .send({
        name: 'John Smith'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.name).toBe('John Smith');
  });
});