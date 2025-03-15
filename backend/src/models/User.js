import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';
import AccountModel from './Account.js';

const UserModel = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    unique: true,
    primaryKey: true,
    references: {
      model: AccountModel,
      key: 'id'
    }
  }
}, {
  tableName: 'user',
  timestamps: false
});

export default UserModel;