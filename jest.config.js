module.exports = {
    testMatch: [
      "**/*.spec.ts",
    ],
    modulePathIgnorePatterns: [
      "<rootDir>/dist/",
    ],
    verbose: true,
    reporters: [
      "default",
    ],
    preset: "ts-jest",
  }
