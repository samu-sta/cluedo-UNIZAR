const path = require('path');

// jest-preset.js
module.exports = {
  // Importante: Este resolver ayuda a Jest a encontrar los archivos correctamente
  resolver: path.join(__dirname, 'jest-resolver.js'),
  
  // Configuraciones adicionales
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  
  // Esto es crucial para que los imports sin extensión .js funcionen
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  
  // Configuración para manejo de ESM y CommonJS
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './.babelrc' }]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'
  ]
};