module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  globalSetup: "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup",
  globalTeardown:
    "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown",
};
