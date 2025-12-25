export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'api/**/*.js',
    'src/**/*.js',
    '!**/*.test.js',
  ],
};
