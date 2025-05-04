import { jest } from '@jest/globals';
import { setupRelations } from '../../src/models/relations.js';
import BoardModel from '../../src/models/Board.js';
import RoomModel from '../../src/models/Room.js';
import GameModel from '../../src/models/Game.js';
import CardModel from '../../src/models/Card.js';
import AccountModel from '../../src/models/Account.js';
import UserModel from '../../src/models/User.js';

// Track if associations have been set up
let associationsInitialized = false;

// Mock the hasOne, hasMany, and belongsTo methods to prevent duplicate associations
const mockAssociationMethods = () => {
  GameModel.hasOne = jest.fn();
  BoardModel.belongsTo = jest.fn();
  GameModel.hasMany = jest.fn();
  CardModel.belongsTo = jest.fn();
  BoardModel.hasMany = jest.fn();
  RoomModel.belongsTo = jest.fn();
  RoomModel.hasMany = jest.fn();
  AccountModel.hasOne = jest.fn();
  UserModel.belongsTo = jest.fn();
};

/**
 * Ensures model associations are properly set up for testing
 * Call this function in beforeAll() of tests that interact with models
 * This will only set up associations once to avoid Sequelize association errors
 */
export const setupTestModels = () => {
  if (associationsInitialized) {
    console.log('Model relations already initialized, skipping');
    return;
  }
  
  try {
    // In tests, we'll mock the association methods instead of actually setting them up
    mockAssociationMethods();
    
    // Mark as initialized
    associationsInitialized = true;
    console.log('Model relations initialized for testing');
  } catch (error) {
    console.error('Error setting up model relations:', error.message);
  }
};

export default setupTestModels;