/*************************************************
 * Test de integración para sockets de juego
 * 
 * Este test verifica la integración correcta
 * entre socket.io y la lógica del juego Cluedo,
 * validando la comunicación en tiempo real entre
 * los jugadores y el servidor.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const io = require('socket.io-client');
const { app, server } = require('../server');
const { Game } = require('../game');
const { Player } = require('../player');

describe('Game Socket Integration Test', () => {
  let clientSocket;
  let game;

  beforeAll((done) => {
    server.listen(() => {
      clientSocket = io.connect(`http://localhost:${server.address().port}`, {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true,
        transports: ['websocket'],
      });
      clientSocket.on('connect', done);
    });
  });

  afterAll((done) => {
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    server.close(done);
  });

  beforeEach(() => {
    game = new Game();
  });

  test('should connect to the server', (done) => {
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  test('should join a game', (done) => {
    const player = new Player('Player1');
    clientSocket.emit('joinGame', player);

    clientSocket.on('gameJoined', (gameState) => {
      expect(gameState.players).toContainEqual(player);
      done();
    });
  });

  // Add more tests as needed
});