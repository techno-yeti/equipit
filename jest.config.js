module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  setupFiles: ["<rootDir>/test/setup.js"],
  verbose: true,
  collectCoverageFrom: [
    "src/helpers/**/*.js",
    "src/services/**/*.js",
    "src/middleware/**/*.js",
  ],
};
