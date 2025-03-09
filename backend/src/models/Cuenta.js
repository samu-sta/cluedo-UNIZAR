import { DataTypes } from 'sequelize';
import sequelize from '../database/database.js';

const Cuenta = sequelize.define('Cuenta', {
  id_cuenta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  correo: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'Cuenta',
  timestamps: false
});

export default Cuenta;