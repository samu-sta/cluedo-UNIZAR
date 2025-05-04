// Mock de la base de datos para tests
import { jest } from '@jest/globals';

const mockDataTypes = {
  STRING: 'STRING',
  INTEGER: 'INTEGER',
  BOOLEAN: 'BOOLEAN',
  TEXT: 'TEXT',
  DATE: 'DATE',
  FLOAT: 'FLOAT',
  ENUM: (...args) => `ENUM(${args.join(',')})`,
  ARRAY: (type) => `ARRAY(${type})`,
  JSON: 'JSON',
};

const mockSequelize = {
  authenticate: jest.fn().mockResolvedValue(),
  define: jest.fn((modelName) => ({
    name: modelName,
    belongsTo: jest.fn().mockReturnThis(),
    hasMany: jest.fn().mockReturnThis(),
    findOne: jest.fn(),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    findByPk: jest.fn(),
    build: jest.fn(data => ({
      ...data,
      save: jest.fn().mockResolvedValue(data)
    })),
    bulkCreate: jest.fn(),
    count: jest.fn(),
    sync: jest.fn(),
  })),
  sync: jest.fn().mockResolvedValue(),
  transaction: jest.fn(() => ({
    commit: jest.fn(),
    rollback: jest.fn(),
  })),
  QueryTypes: {
    SELECT: 'SELECT',
  },
  DataTypes: mockDataTypes,
  Op: {
    eq: Symbol('eq'),
    ne: Symbol('ne'),
    is: Symbol('is'),
    not: Symbol('not'),
    or: Symbol('or'),
    and: Symbol('and'),
    gt: Symbol('gt'),
    gte: Symbol('gte'),
    lt: Symbol('lt'),
    lte: Symbol('lte'),
    between: Symbol('between'),
    notBetween: Symbol('notBetween'),
    in: Symbol('in'),
    notIn: Symbol('notIn'),
    like: Symbol('like'),
    notLike: Symbol('notLike'),
  },
  fn: {
    col: jest.fn(),
    cast: jest.fn(),
    literal: jest.fn(),
  },
};

export const sequelize = mockSequelize;
export const DataTypes = mockDataTypes;
export default mockSequelize;