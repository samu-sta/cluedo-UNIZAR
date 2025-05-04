// filepath: c:\Users\Daniel\Documents\GitHub\cluedo-UNIZAR_PRUEBAS\backend\test\unit\database\init.test.js
import { jest } from '@jest/globals';
import sequelize from '../../../src/database/database';

// Mock the models
jest.mock('../../../src/models/User', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Account', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Game', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Board', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Room', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Door', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Wall', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

jest.mock('../../../src/models/Card', () => {
  return {
    sync: jest.fn().mockResolvedValue(true)
  };
});

// Mock the actual database module
jest.mock('../../../src/database/database', () => {
  return {
    sync: jest.fn().mockResolvedValue(true),
    authenticate: jest.fn().mockResolvedValue(true)
  };
});

describe('Database Initialization', () => {
  describe('Database connection', () => {
    it('should authenticate successfully with the database', async () => {
      // Import the module now that we've set up our mocks
      const initDb = await import('../../../src/database/init');

      // Call the initialization function
      await initDb.default();

      // Verify the database was authenticated
      expect(sequelize.authenticate).toHaveBeenCalled();
    });

    it('should sync models with the database', async () => {
      // Import the module
      const initDb = await import('../../../src/database/init');

      // Call the initialization function
      await initDb.default();

      // Verify the database was synced
      expect(sequelize.sync).toHaveBeenCalledWith({ alter: true });
    });
  });
});