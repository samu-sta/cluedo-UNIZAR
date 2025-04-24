export default {
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/test/__mocks__/fileMock.js',
    '^@/(.*)$': '<rootDir>/src/$1',
    '^../../../../schemas/schemas$': '<rootDir>/test/__mocks__/schemas.js',
    '^../../../../services/User$': '<rootDir>/src/services/__mocks__/User.js'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest']
  },
  extensionsToTreatAsEsm: ['.jsx']
};