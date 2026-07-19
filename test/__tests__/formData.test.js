const mongoose = require("mongoose");

const createChainable = (result) => ({
  sort: jest.fn().mockReturnThis(),
  lean: jest.fn().mockResolvedValue(result),
});

const mockDepotSites = [
  { _id: "site1", name: "Depot A" },
  { _id: "site2", name: "Depot B" },
];

const mockEquipmentTypes = [
  { _id: "eq1", name: "Roll Cage" },
  { _id: "eq2", name: "Full Tray" },
];

const mockTemplates = [{ _id: "tpl1", name: "Standard", equipments: [] }];

jest.mock("../../src/models/DepotSite", () => ({
  find: jest.fn(() => createChainable(mockDepotSites)),
}));

jest.mock("../../src/models/EquipmentType", () => ({
  find: jest.fn(() => createChainable(mockEquipmentTypes)),
}));

jest.mock("../../src/models/Template", () => ({
  find: jest.fn(() => createChainable(mockTemplates)),
}));

describe("getFormData", () => {
  let getFormData;
  const DepotSite = require("../../src/models/DepotSite");
  const EquipmentType = require("../../src/models/EquipmentType");
  const Template = require("../../src/models/Template");

  beforeAll(() => {
    getFormData = require("../../src/helpers/formData").getFormData;
  });

  test("returns templates, equipmentTypes, and depotSites", async () => {
    const result = await getFormData();
    expect(result).toHaveProperty("templates");
    expect(result).toHaveProperty("equipmentTypes");
    expect(result).toHaveProperty("depotSites");
    expect(result.templates).toHaveLength(1);
    expect(result.equipmentTypes).toHaveLength(2);
    expect(result.depotSites).toHaveLength(2);
  });

  test("calls find on all three models", async () => {
    await getFormData();
    expect(EquipmentType.find).toHaveBeenCalled();
    expect(Template.find).toHaveBeenCalled();
    expect(DepotSite.find).toHaveBeenCalled();
  });
});

describe("getEquipmentTypes", () => {
  let getEquipmentTypes;

  beforeAll(() => {
    getEquipmentTypes = require("../../src/helpers/formData").getEquipmentTypes;
  });

  test("returns equipment types", async () => {
    const result = await getEquipmentTypes();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });
});
