import Cuenta from './Cuenta.js';
import Usuario from './Usuario.js';
import Administrador from './Administrador.js';

const initModels = () => {
  Usuario.belongsTo(Cuenta, { 
    foreignKey: 'idCuenta',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Administrador.belongsTo(Cuenta, { 
    foreignKey: 'idCuenta',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Cuenta.hasOne(Usuario, { 
    foreignKey: 'idCuenta',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  Cuenta.hasOne(Administrador, { 
    foreignKey: 'idCuenta',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  
  return {
    Cuenta,
    Usuario,
    Administrador
  };
};

export default initModels;