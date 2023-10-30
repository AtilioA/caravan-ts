module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: ["jest", "/node_modules/", "/__mocks__/", "/dist/"],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover"],
  collectCoverageFrom: [
    "src/**/*.ts", "!src/**/*.d.ts",
  ],
  setupFilesAfterEnv: ["./src/__tests__/jest.globalSetup.ts"],
  coverageThreshold: {
    "global": {
      "branches": 95,
      "functions": 100,
      "lines": 98,
      "statements": 98
    }
  }
};
