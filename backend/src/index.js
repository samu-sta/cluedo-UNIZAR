import { createApp } from './app/app.js';
import UserModel from './models/User.js';
import Cuenta from './models/Cuenta.js';
import Usuario from './models/Usuario.js';
import Administrador from './models/Administrador.js';

Cuenta.hasOne(Usuario, { foreignKey: 'idCuenta' });
Cuenta.hasOne(Administrador, { foreignKey: 'idCuenta' });

createApp({userModel: UserModel});

