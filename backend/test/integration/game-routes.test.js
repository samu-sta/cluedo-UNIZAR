/*************************************************
 * Test de integración para rutas de juego
 * 
 * Este test verifica la integración correcta
 * entre las rutas de juego, los controladores y
 * los modelos, validando la creación, unión y
 * gestión de partidas de Cluedo.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const request = require('supertest');
const app = require('../app');
const Game = require('../models/game');
const User = require('../models/user');

describe('Game Routes', () => {
  let gameId;
  let userId;

  beforeAll(async () => {
    const user = await User.create({ username: 'testuser', password: 'password' });
    userId = user._id;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Game.deleteMany({});
  });

  test('should create a new game', async () => {
    const response = await request(app)
      .post('/games')
      .send({ name: 'Test Game', owner: userId });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Game');
    expect(response.body.owner).toBe(String(userId));
    gameId = response.body._id;
  });

  test('should join an existing game', async () => {
    const response = await request(app)
      .post(`/games/${gameId}/join`)
      .send({ userId });

    expect(response.status).toBe(200);
    expect(response.body.players).toContain(String(userId));
  });

  test('should get game details', async () => {
    const response = await request(app).get(`/games/${gameId}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(String(gameId));
    expect(response.body.name).toBe('Test Game');
  });
});