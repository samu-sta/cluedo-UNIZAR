/**
 * Este archivo configura el entorno de pruebas global
 * Se ejecuta antes de cada test
 */
// Importamos los mocks centralizados
import * as mocks from './__mocks__/setupMocks.js';
// Configuramos variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.PORT = '3001';
// Establecemos el timeout para las pruebas
jest.setTimeout(20000);
// Configuramos jest para que no muestre errores de consola
// durante la ejecución de tests
console.error = jest.fn();
console.warn = jest.fn();
// Configuramos los mocks para los diferentes módulos
jest.mock('../src/services/GameService.js', () => ({
  __esModule: true,
  default: mocks.gameServiceMock,
  gameService: mocks.gameServiceMock
}), { virtual: true });
jest.mock('../src/services/CardService.js', () => ({
  __esModule: true,
  default: mocks.cardServiceMock,
  cardService: mocks.cardServiceMock
}), { virtual: true });
jest.mock('../src/services/TurnService.js', () => ({
  __esModule: true,
  default: mocks.turnServiceMock,
  turnService: mocks.turnServiceMock
}), { virtual: true });
jest.mock('../src/services/PlayerService.js', () => ({
  __esModule: true,
  default: mocks.playerServiceMock,
  playerService: mocks.playerServiceMock
}), { virtual: true });
jest.mock('../src/services/BoardService.js', () => ({
  __esModule: true,
  default: mocks.boardServiceMock,
  boardService: mocks.boardServiceMock
}), { virtual: true });
jest.mock('../src/services/SuggestionService.js', () => ({
  __esModule: true,
  default: mocks.suggestionServiceMock,
  suggestionService: mocks.suggestionServiceMock
}), { virtual: true });
jest.mock('../src/services/GameControllerService.js', () => ({
  __esModule: true,
  default: mocks.gameControllerServiceMock,
  gameControllerService: mocks.gameControllerServiceMock
}), { virtual: true });
jest.mock('../src/socket/GameStateManager.js', () => ({
  __esModule: true,
  default: mocks.gameStateManagerMock,
  GameStateManager: jest.fn().mockImplementation(() => mocks.gameStateManagerMock)
}), { virtual: true });
jest.mock('../src/socket/CountdownManager.js', () => ({
  __esModule: true,
  default: mocks.countdownManagerMock,
  CountdownManager: jest.fn().mockImplementation(() => mocks.countdownManagerMock)
}), { virtual: true });
// Mocks para las utilidades
jest.mock('../src/utils/board.js', () => ({
  ...mocks.boardUtilsMock,
  __esModule: true
}), { virtual: true });
jest.mock('../src/utils/game.js', () => ({
  ...mocks.gameUtilsMock,
  __esModule: true
}), { virtual: true });
jest.mock('../src/utils/arrayUtils.js', () => ({
  ...mocks.arrayUtilsMock,
  __esModule: true
}), { virtual: true });
jest.mock('../src/utils/auth.js', () => ({
  ...mocks.authUtilsMock,
  __esModule: true
}), { virtual: true });
// Mock para jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockReturnValue({ id: 'test-user-id' })
}));
// Mock de sequelize para evitar errores con ENUM
jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  const { DataTypes } = actualSequelize;
  // Fix para el método ENUM
  DataTypes.ENUM = (...args) => ({
    key: 'ENUM',
    values: args,
    toString: () => `ENUM(${args.join(', ')})`,
  });
  return {
    ...actualSequelize,
    DataTypes,
    Sequelize: actualSequelize,
  };
});
// Mock de jsonwebtoken para los tests de autenticación
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockImplementation((token, secret) => {
    if (token === 'valid-token') {
      return { id: 'test-user-id' };
    } else {
      throw new Error('Invalid token');
    }
  }),
}));
// Mock de argon2 para los tests de autenticación
jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  verify: jest.fn().mockResolvedValue(true),
}));
// Configuración de timeouts más largos para tests que lo necesiten
jest.setTimeout(10000);

// Note: Removed afterEach cleanup to fix module compatibility issues
// Jest will automatically clean up mocks between tests with clearMocks: true in jest.config.js
