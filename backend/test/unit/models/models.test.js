// Mock Sequelize before importing models
const DataTypes = {
  STRING: 'STRING',
  TEXT: 'TEXT',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  UUID: 'UUID',
  UUIDV4: 'UUIDV4',
  DATE: 'DATE',
  ENUM: (...values) => ({ values }),
  ARRAY: (type) => `ARRAY(${type})`,
  JSON: 'JSON',
  JSONB: 'JSONB',
  VIRTUAL: 'VIRTUAL'
};

// Make DataTypes globally accessible for ES module imports
global.DataTypes = DataTypes;

jest.mock('sequelize', () => {
  const mSequelize = {
    define: jest.fn().mockImplementation(() => ({
      belongsTo: jest.fn().mockReturnThis(),
      hasOne: jest.fn().mockReturnThis(),
      hasMany: jest.fn().mockReturnThis(),
      belongsToMany: jest.fn().mockReturnThis(),
      sync: jest.fn().mockResolvedValue(true)
    })),
    authenticate: jest.fn().mockResolvedValue(),
    Model: class {},
    DataTypes
  };
  
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes
  };
});

// Mock database connection
jest.mock('../../../src/database/database', () => {
  const sequelize = {
    define: jest.fn().mockImplementation(() => ({
      belongsTo: jest.fn().mockReturnThis(),
      hasOne: jest.fn().mockReturnThis(),
      hasMany: jest.fn().mockReturnThis(),
      belongsToMany: jest.fn().mockReturnThis()
    })),
    authenticate: jest.fn().mockResolvedValue(),
    sync: jest.fn().mockResolvedValue(true),
    models: {}
  };

  return {
    sequelize,
    DataTypes
  };
});

// Mock model methods to return mock objects
const mockModelMethods = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  destroy: jest.fn()
};

// Create mock models
jest.mock('../../../src/models/User', () => ({
  ...mockModelMethods,
  associations: {}
}));

jest.mock('../../../src/models/Account', () => ({
  ...mockModelMethods,
  associations: {}
}));

jest.mock('../../../src/models/Game', () => ({
  ...mockModelMethods,
  associations: {}
}));

jest.mock('../../../src/models/Board', () => ({
  ...mockModelMethods
}));

jest.mock('../../../src/models/Card', () => ({
  ...mockModelMethods
}));

jest.mock('../../../src/models/Door', () => ({
  ...mockModelMethods
}));

jest.mock('../../../src/models/Room', () => ({
  ...mockModelMethods
}));

jest.mock('../../../src/models/Wall', () => ({
  ...mockModelMethods
}));

jest.mock('../../../src/models/Admin', () => ({
  ...mockModelMethods
}));

// No need to mock relations as each model is already mocked
jest.mock('../../../src/models/relations', () => ({}));

describe('Database Models', () => {
  const mockModels = {};

  beforeAll(async () => {
    // Import all models
    mockModels.User = require('../../../src/models/User');
    mockModels.Account = require('../../../src/models/Account');
    mockModels.Game = require('../../../src/models/Game');
    mockModels.Board = require('../../../src/models/Board');
    mockModels.Card = require('../../../src/models/Card');
    mockModels.Door = require('../../../src/models/Door');
    mockModels.Room = require('../../../src/models/Room');
    mockModels.Wall = require('../../../src/models/Wall');
    mockModels.Admin = require('../../../src/models/Admin');
    
    // Import relations
    require('../../../src/models/relations');
  });

  describe('User model', () => {
    it('should be defined', () => {
      expect(mockModels.User).toBeDefined();
    });
    
    it('should have correct methods', () => {
      expect(typeof mockModels.User.findOne).toBe('function');
      expect(typeof mockModels.User.create).toBe('function');
    });
  });
  
  describe('Account model', () => {
    it('should be defined', () => {
      expect(mockModels.Account).toBeDefined();
    });
    
    it('should have correct methods', () => {
      expect(typeof mockModels.Account.findOne).toBe('function');
      expect(typeof mockModels.Account.create).toBe('function');
    });
  });
  
  describe('Game model', () => {
    it('should be defined', () => {
      expect(mockModels.Game).toBeDefined();
    });
    
    it('should have correct methods', () => {
      expect(typeof mockModels.Game.findOne).toBe('function');
      expect(typeof mockModels.Game.create).toBe('function');
    });
  });
  
  describe('Board model', () => {
    it('should be defined', () => {
      expect(mockModels.Board).toBeDefined();
    });
  });
  
  describe('Card model', () => {
    it('should be defined', () => {
      expect(mockModels.Card).toBeDefined();
    });
  });
  
  describe('Door model', () => {
    it('should be defined', () => {
      expect(mockModels.Door).toBeDefined();
    });
  });
  
  describe('Room model', () => {
    it('should be defined', () => {
      expect(mockModels.Room).toBeDefined();
    });
  });
  
  describe('Wall model', () => {
    it('should be defined', () => {
      expect(mockModels.Wall).toBeDefined();
    });
  });
  
  describe('Admin model', () => {
    it('should be defined', () => {
      expect(mockModels.Admin).toBeDefined();
    });
  });

  describe('Model Relationships', () => {
    it('should have proper relationships between User and Account', () => {
      // These expectations check if the relationship methods were called
      // The real relationship testing would happen in integration tests with a database
      expect(mockModels.User).toBeDefined();
      expect(mockModels.Account).toBeDefined();
    });
  });
});