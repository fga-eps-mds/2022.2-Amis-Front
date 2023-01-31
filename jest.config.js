module.exports = {
  coverageReporters: [
    "json-summary", 
    "text",
    "lcov"
  ],
  collectCoverageFrom: [
    "src/**/**/*.{ts,tsx}",
    "src/**/**/**/*.{ts,tsx}",
    "!src/**/**/**/*.dto.{ts,tsx}",
    "!src/styles/globalStyle.ts",
    "!src/vite-env.d.ts",
    "!src/main.tsx",
    "!src/App.tsx",
  ],
  collectCoverage: true,
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/.jest/setup-tests.js'],
  transform: {
    ".*\\.[jt]sx?$": "babel-jest",
  },
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: './',
        outputName: 'jest-report.xml',
        reportedFilePath: 'relative',
        relativeRootDir: '<rootDir>/../',
      },
    ],
  ],
  "moduleNameMapper": {
    "^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
  },
}