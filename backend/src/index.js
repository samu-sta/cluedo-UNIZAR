import { createApp } from './app/app.js';
import UserModel from './models/User.js';
import initModels from './models/realtions.js';

const models = initModels();
createApp({userModel: UserModel});

