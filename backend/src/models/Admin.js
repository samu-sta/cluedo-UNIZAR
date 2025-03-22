import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import AccountModel from './Account.js';

const AdminModel = sequelize.define('Admin', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  accountId: {
    type: DataTypes.INTEGER,
    unique: true,
    references: {
      model: AccountModel,
      key: 'id'
    }
  }
}, {
  tableName: 'Admin',
  timestamps: false,
  sequelize
});


export default AdminModel;
