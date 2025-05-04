module.exports = {
  // Use the babel transformer for all JavaScript and JSX files        
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  // Automatically clear mock calls and instances between every test   
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: false,
  // The maximum amount of workers used to run your tests
  maxWorkers: "50%",
  // A map from regular expressions to paths to transformers
  testEnvironment: "node",
  // Setup files to run before each test
  setupFiles: ["./test/setup.js"],
  // Test runners to use
  testRunner: "jest-circus/runner",
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  // Mock all imported modules by default
  automock: false,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  // A set of global variables that need to be available in all test environments
  globals: {
    NODE_ENV: "test"
  },
  // An array of regexp pattern strings that are matched against all test paths before executing the test
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  // Use this configuration option to add custom reporters to Jest     
  reporters: [
    "default"
  ],
  // Configure how tests are retried after failures
  bail: true,
  // Set the timeout for individual test cases
  testTimeout: 10000,
  // An array of file extensions your modules use
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],    
  // A map from regular expressions to module names that allow to stub out resources with a single module
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1"
  },
  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: [
    "/node_modules/(?!uuid)"
  ]
};
