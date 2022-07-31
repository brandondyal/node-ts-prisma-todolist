const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./setupTests.ts'],
  testMatch: ['/**/*test.(js|ts)'],
  verbose: true,
};

export default config;
