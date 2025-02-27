export default {
  // globalSetup: './tests/setup/jest-setup.ts',
  // globalTeardown: './tests/setup/jest-teardown.ts',
  coveragePathIgnorePatterns: ['.config.ts'],
  preset: 'ts-jest',
  testTimeout: process.env.CI ? 120_000 : 12_000,
  transform: {
    '^.+\\.ts?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  moduleNameMapper: {
    '^@middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^@routes/(.*)$': '<rootDir>/src/routes/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
  },
  resolver: 'jest-ts-webcompat-resolver',
  testPathIgnorePatterns: ['/e2e/', '/node_modules/', '/dist/'],
  // testEnvironment: 'node',
  // Run tests serially on local machine to avoid race conditions on docker resources
  ...(!process.env.CI && { maxWorkers: 1 }),
};
