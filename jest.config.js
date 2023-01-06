module.exports = {
  coverageReporters: [
    "json-summary", 
    "text",
    "lcov"
  ],
  collectCoverageFrom: [
    "src/**/**/*.{ts,tsx}",
    "src/**/**/**/*.{ts,tsx}",
  ],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-tests.js'],
  transform: {
    ".*\\.[jt]sx?$": "babel-jest",
  }
}