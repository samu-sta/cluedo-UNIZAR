import sequelize from './database/database.js';
import Cuenta from './models/Cuenta.js';
import Usuario from './models/Usuario.js';
import Administrador from './models/Administrador.js';
import { createApp } from './app/app.js';

createApp();
Cuenta.hasOne(sequelize.models.Usuario, { foreignKey: 'idCuenta' });
Usuario.belongsTo(sequelize.models.Cuenta, { foreignKey: 'idCuenta' });

Cuenta.hasOne(sequelize.models.Administrador, { foreignKey: 'idCuenta' });
Administrador.belongsTo(sequelize.models.Cuenta, { foreignKey: 'idCuenta' });

sequelize.sync();

console.log('Modelos cargados y relaciones definidas');