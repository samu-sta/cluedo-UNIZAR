import { Sequelize } from 'sequelize';
import AccountModel from '../models/Account.js';
import userModel from '../models/User.js';
import adminModel from '../models/Admin.js';


const initDatabase = async () => {
  try {
    const tempSequelize = new Sequelize({
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      dialect: 'mysql'
    });

    await tempSequelize.query(`DROP DATABASE IF EXISTS \`${process.env.DB_NAME}\`;`);
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await tempSequelize.close();
    console.log('Connection has been established successfully.');


    await AccountModel.sync({ force: true });
    await userModel.sync({ force: true });
    await adminModel.sync({ force: true });

    console.log('Database initialized successfully');

  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDatabase();