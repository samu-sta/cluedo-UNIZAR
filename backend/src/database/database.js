/*************************************************
 * Configuración de conexión a la base de datos
 * 
 * Este archivo establece la conexión con la base de
 * datos MySQL utilizando Sequelize y las variables
 * de entorno para la configuración.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dialect: 'mysql',
  logging: false
});


export default sequelize;