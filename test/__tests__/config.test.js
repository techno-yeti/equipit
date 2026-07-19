describe("config/env", () => {
  test("loads config with required env vars", () => {
    const config = require("../../src/config/env");
    expect(config.port).toBe(3001);
    expect(config.mongoUri).toBe("mongodb://localhost:27017/equipit_test");
    expect(config.jwtSecret).toBe("test-jwt-secret");
    expect(config.appBaseUrl).toBe("http://localhost:3001");
  });

  test("identifies test environment correctly", () => {
    const config = require("../../src/config/env");
    expect(config.isTest).toBe(true);
    expect(config.isProduction).toBe(false);
  });

  test("derives cors origins from string", () => {
    const config = require("../../src/config/env");
    expect(Array.isArray(config.corsAllowedOrigins)).toBe(true);
    expect(config.corsAllowedOrigins).toContain("http://localhost:3001");
  });

  test("isDevelopment is false in test environment", () => {
    const config = require("../../src/config/env");
    expect(config.isDevelopment).toBe(false);
  });

  test("parses port number correctly", () => {
    const config = require("../../src/config/env");
    expect(typeof config.port).toBe("number");
  });
});
