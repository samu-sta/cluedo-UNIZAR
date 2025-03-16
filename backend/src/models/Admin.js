import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Admin = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: 'Account',
      key: 'id'
    }
  }
}, {
  tableName: 'Admin',
  timestamps: false
});

export default Admin;