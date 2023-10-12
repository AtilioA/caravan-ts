module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/dist/'],
  coverageDirectory: 'coverage',
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    'src/**/*.ts', '!src/**/*.d.ts',
  ],
};
