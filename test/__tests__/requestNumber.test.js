const createChainable = (result) => ({
  lean: jest.fn().mockResolvedValue(result),
});

jest.mock("../../src/models/Request", () => ({
  findOne: jest.fn().mockImplementation(() => createChainable(null)),
}));

describe("generateRequestNumber", () => {
  let generateRequestNumber;

  beforeEach(() => {
    jest.resetModules();
    generateRequestNumber =
      require("../../src/services/requestNumber.service").generateRequestNumber;
  });

  test("generates an 8-character alphanumeric string", async () => {
    const result = await generateRequestNumber();
    expect(result).toMatch(/^[A-Z0-9]{8}$/);
  });

  test("uses only unambiguous characters (no 0, O, I, 1)", async () => {
    const result = await generateRequestNumber();
    expect(result).not.toMatch(/[0OIl1]/);
  });

  test("returns a string", async () => {
    const result = await generateRequestNumber();
    expect(typeof result).toBe("string");
  });

  test("generates different values on subsequent calls", async () => {
    const results = await Promise.all([
      generateRequestNumber(),
      generateRequestNumber(),
      generateRequestNumber(),
    ]);

    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  test("produces exactly 8 characters", async () => {
    const result = await generateRequestNumber();
    expect(result).toHaveLength(8);
  });
});
