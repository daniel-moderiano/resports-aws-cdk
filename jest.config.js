module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>/src/test"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": ["<rootDir>/src/$1"],
  },
  globalSetup: "<rootDir>/node_modules/@databases/pg-test/jest/globalSetup",
  globalTeardown:
    "<rootDir>/node_modules/@databases/pg-test/jest/globalTeardown",
};
