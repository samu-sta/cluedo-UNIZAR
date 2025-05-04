/*************************************************
 * Test de integración para mock del modelo User
 * 
 * Este mock simula el comportamiento del modelo
 * User, permitiendo realizar pruebas unitarias e
 * integradas sin depender de una base de datos real.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

const mockUsers = new Map();
let lastId = 1;

class User {
  static findByPk(id) {
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
  }

  static async findOne({ where }) {
    if (where.username) {
      return Array.from(mockUsers.values()).find(user => user.username === where.username);
    }
    if (where.id) {
      return mockUsers.get(where.id);
    }
    return null;
  }

  static async create(userData) {
    const id = lastId++;
    const user = {
      id,
      ...userData,
      validatePassword: async (password) => password === userData.password
    };
    mockUsers.set(id, user);
    return user;
  }

  static async findAll() {
    return Array.from(mockUsers.values());
  }

  static __resetMockData() {
    mockUsers.clear();
    lastId = 1;
  }
}

module.exports = User;