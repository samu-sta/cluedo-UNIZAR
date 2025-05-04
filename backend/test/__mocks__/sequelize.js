/*************************************************
 * Test de integración para mock de Sequelize
 * 
 * Este mock simula el comportamiento de Sequelize
 * y sus métodos para permitir pruebas sin requerir
 * una conexión a base de datos real.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

// Mock for Sequelize
const DataTypes = {
  STRING: jest.fn().mockImplementation(() => 'STRING'),
  TEXT: jest.fn().mockImplementation(() => 'TEXT'),
  INTEGER: jest.fn().mockImplementation(() => 'INTEGER'),
  FLOAT: jest.fn().mockImplementation(() => 'FLOAT'),
  BOOLEAN: jest.fn().mockImplementation(() => 'BOOLEAN'),
  DATE: jest.fn().mockImplementation(() => 'DATE'),
  JSON: jest.fn().mockImplementation(() => 'JSON'),
};

const SequelizeMock = jest.fn(() => ({
  authenticate: jest.fn().mockResolvedValue(),
  define: jest.fn().mockReturnValue({
    belongsTo: jest.fn().mockReturnThis(),
    hasMany: jest.fn().mockReturnThis(),
    hasOne: jest.fn().mockReturnThis(),
    belongsToMany: jest.fn().mockReturnThis(),
    findOne: jest.fn().mockResolvedValue(null),
    findAll: jest.fn().mockResolvedValue([]),
    create: jest.fn().mockResolvedValue({}),
    destroy: jest.fn().mockResolvedValue(1),
    update: jest.fn().mockResolvedValue([1]),
    count: jest.fn().mockResolvedValue(0),
    increment: jest.fn().mockResolvedValue([{}, true]),
    sync: jest.fn().mockResolvedValue(),
  }),
  transaction: jest.fn().mockImplementation(async (callback) => {
    if (callback) {
      return await callback({
        commit: jest.fn().mockResolvedValue(),
        rollback: jest.fn().mockResolvedValue(),
      });
    }
    return {
      commit: jest.fn().mockResolvedValue(),
      rollback: jest.fn().mockResolvedValue(),
    };
  }),
  QueryTypes: {
    SELECT: 'SELECT',
    INSERT: 'INSERT',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE',
  },
  query: jest.fn().mockResolvedValue([]),
  DataTypes,
}));

// Compatibilidad con ES Modules
SequelizeMock.DataTypes = DataTypes;
export default SequelizeMock;
export { DataTypes };

// Compatibilidad con CommonJS
module.exports = SequelizeMock;
module.exports.DataTypes = DataTypes;