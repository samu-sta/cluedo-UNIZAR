import Cuenta from './Cuenta.js';
import Usuario from './Usuario.js';
import Administrador from './Administrador.js';

Cuenta.hasOne(Usuario, { foreignKey: 'idCuenta' });
Cuenta.hasOne(Administrador, { foreignKey: 'idCuenta' });

export { Cuenta, Usuario, Administrador };