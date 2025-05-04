// Este archivo configura el entorno global antes de ejecutar las pruebas
const path = require('path');
const fs = require('fs');

// Asegurar que estamos en modo test
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';

// Crear un directorio temporal para almacenas datos de prueba si es necesario
const setupTestDir = () => {
  const tempDir = path.join(__dirname, 'temp');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  return tempDir;
};

module.exports = async () => {
  // Configuración global que se ejecuta una sola vez antes de todos los tests
  console.log('\nConfigurando entorno de pruebas...');

  // Crear directorio temporal si es necesario
  const tempDir = setupTestDir();
  
  // Definir variables globales para todas las pruebas
  global.__TEST_CONFIG__ = {
    tempDir,
    mockData: {
      games: [
        {
          id: 'mock-game-id',
          name: 'Mock Game',
          status: 'waiting',
          hostId: 'mock-host-id',
          players: [
            { id: 'player1', username: 'Player 1', isHost: true },
            { id: 'player2', username: 'Player 2', isHost: false }
          ],
          maxPlayers: 6,
          board: {
            width: 24,
            height: 25
          }
        }
      ],
      users: [
        {
          id: 'mock-user-id',
          username: 'testuser',
          email: 'test@example.com'
        }
      ],
      cards: {
        characters: [
          { id: 'char1', type: 'character', value: 'Colonel Mustard' },
          { id: 'char2', type: 'character', value: 'Professor Plum' },
          { id: 'char3', type: 'character', value: 'Mrs. White' }
        ],
        weapons: [
          { id: 'weap1', type: 'weapon', value: 'Candlestick' },
          { id: 'weap2', type: 'weapon', value: 'Knife' },
          { id: 'weap3', type: 'weapon', value: 'Rope' }
        ],
        rooms: [
          { id: 'room1', type: 'room', value: 'Kitchen' },
          { id: 'room2', type: 'room', value: 'Ballroom' },
          { id: 'room3', type: 'room', value: 'Conservatory' }
        ]
      },
      solution: {
        character: { id: 'char1', type: 'character', value: 'Colonel Mustard' },
        weapon: { id: 'weap1', type: 'weapon', value: 'Candlestick' },
        room: { id: 'room1', type: 'room', value: 'Kitchen' }
      }
    }
  };

  // No podemos usar jest.setTimeout aquí porque jest no está disponible en globalSetup
  // Estableceremos el tiempo de espera en setup.js en su lugar

  console.log('Entorno de pruebas configurado correctamente.\n');
};