// swc issues
// https://github.com/swc-project/swc/issues/3559
// https://github.com/swc-project/jest/issues/62
// https://github.com/swc-project/cli/issues/20

const jestConfig = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { configFile: '.swcrc-jest' }],
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['/**/*test.(js|ts)'],
  verbose: true,
};

export default jestConfig;
