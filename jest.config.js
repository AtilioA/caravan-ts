module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/__mocks__/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', '!src/**/*.d.ts', // Adjust this path if your source files are located in a different directory
  ],
};
