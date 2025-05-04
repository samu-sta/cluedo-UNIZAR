import { jest } from '@jest/globals';

const mockAccounts = new Map();
let lastId = 1;

const Account = {
  findByPk: jest.fn().mockImplementation(id => {
    if (id === '123') {
      return Promise.resolve({
        id: '123',
        username: 'testuser'
      });
    }
    if (id === '404') {
      return Promise.resolve(null);
    }
    return Promise.resolve(null);
  }),
  
  findOne: jest.fn().mockImplementation(({ where }) => {
    if (where.username) {
      return Promise.resolve(
        Array.from(mockAccounts.values()).find(user => user.username === where.username)
      );
    }
    if (where.id) {
      return Promise.resolve(mockAccounts.get(where.id));
    }
    return Promise.resolve(null);
  }),
  
  create: jest.fn().mockImplementation(userData => {
    const id = lastId++;
    const user = {
      id,
      ...userData,
      validatePassword: jest.fn().mockImplementation(password => password === userData.password)
    };
    mockAccounts.set(id, user);
    return Promise.resolve(user);
  }),
  
  findAll: jest.fn().mockImplementation(() => {
    return Promise.resolve(Array.from(mockAccounts.values()));
  }),
  
  __resetMockData: () => {
    mockAccounts.clear();
    lastId = 1;
  }
};

export default Account;