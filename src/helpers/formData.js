const Template = require("../models/Template");
const EquipmentType = require("../models/EquipmentType");
const DepotSite = require("../models/DepotSite");

async function getFormData() {
  const [templates, equipmentTypes, depotSites] = await Promise.all([
    Template.find().sort({ name: 1 }).lean(),
    EquipmentType.find().sort({ name: 1 }).lean(),
    DepotSite.find().sort({ name: 1 }).lean(),
  ]);
  return { templates, equipmentTypes, depotSites };
}

async function getValidFormData() {
  const data = await getFormData();
  data.templates = data.templates.filter(
    (t) => t.equipments && t.equipments.length > 0,
  );
  return data;
}

async function getEquipmentTypes() {
  return EquipmentType.find().sort({ name: 1 }).lean();
}

module.exports = { getFormData, getEquipmentTypes, getValidFormData };
