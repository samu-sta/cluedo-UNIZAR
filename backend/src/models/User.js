import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import AccountModel from './Account.js';

const UserModel = sequelize.define('User', {
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
  tableName: 'User',
  timestamps: false,
  sequelize
});

export default UserModel;