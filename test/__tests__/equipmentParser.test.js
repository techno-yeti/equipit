const { parseEquipmentAllocation } = require("../../src/helpers/equipmentParser");

describe("parseEquipmentAllocation", () => {
  test("returns empty array when equipmentType is null", () => {
    expect(parseEquipmentAllocation(null, null)).toEqual([]);
  });

  test("returns empty array when equipmentType is undefined", () => {
    expect(parseEquipmentAllocation(undefined, undefined)).toEqual([]);
  });

  test("returns empty array when quantity is 0", () => {
    const result = parseEquipmentAllocation("id1", "0");
    expect(result).toEqual([]);
  });

  test("parses single equipment item", () => {
    const result = parseEquipmentAllocation("id1", "5");
    expect(result).toEqual([{ equipmentType: "id1", quantity: 5 }]);
  });

  test("parses multiple equipment items from arrays", () => {
    const types = ["id1", "id2", "id3"];
    const qtys = ["5", "10", "3"];
    const result = parseEquipmentAllocation(types, qtys);
    expect(result).toEqual([
      { equipmentType: "id1", quantity: 5 },
      { equipmentType: "id2", quantity: 10 },
      { equipmentType: "id3", quantity: 3 },
    ]);
  });

  test("skips items with missing type", () => {
    const types = ["", "id2"];
    const qtys = ["5", "10"];
    const result = parseEquipmentAllocation(types, qtys);
    expect(result).toEqual([{ equipmentType: "id2", quantity: 10 }]);
  });

  test("skips items with zero or negative quantity", () => {
    const types = ["id1", "id2", "id3"];
    const qtys = ["0", "-1", "3"];
    const result = parseEquipmentAllocation(types, qtys);
    expect(result).toEqual([{ equipmentType: "id3", quantity: 3 }]);
  });

  test("parses single value with array quantity", () => {
    const result = parseEquipmentAllocation("id1", ["5"]);
    expect(result).toEqual([{ equipmentType: "id1", quantity: 5 }]);
  });

  test("parses array types with single quantity", () => {
    const result = parseEquipmentAllocation(["id1"], "5");
    expect(result).toEqual([{ equipmentType: "id1", quantity: 5 }]);
  });

  test("handles non-numeric quantity gracefully", () => {
    const result = parseEquipmentAllocation("id1", "abc");
    expect(result).toEqual([]);
  });

  test("handles negative quantity after parsing", () => {
    const result = parseEquipmentAllocation("id1", "-5");
    expect(result).toEqual([]);
  });
});
