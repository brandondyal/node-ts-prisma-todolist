const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['/**/*test.(js|ts)'],
  verbose: true,
};

export default config;
