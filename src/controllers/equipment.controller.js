const EquipmentType = require("../models/EquipmentType");
const { serverError, notFound } = require("../helpers/errorResponse");

const ENTITY = "equipment type";

async function getEquipment(req, res) {
  try {
    const equipment = await EquipmentType.find().sort({ name: 1 }).lean();
    res.render("equipment/index", { equipment, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}s`);
  }
}

function getCreateEquipment(req, res) {
  res.render("equipment/form", {
    equipment: null,
    user: req.user,
    error: null,
  });
}

async function postCreateEquipment(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.render("equipment/form", {
        equipment: null,
        user: req.user,
        error: "Equipment type name is required",
      });
    }

    const existing = await EquipmentType.findOne({ name: name.trim() });
    if (existing) {
      return res.render("equipment/form", {
        equipment: null,
        user: req.user,
        error: "An equipment type with this name already exists",
      });
    }

    await EquipmentType.create({
      name: name.trim(),
      description: description?.trim() || "",
    });
    res.redirect("/equipment");
  } catch (err) {
    console.error("Error creating equipment:", err);
    res.render("equipment/form", {
      equipment: null,
      user: req.user,
      error: `Failed to create ${ENTITY}`,
    });
  }
}

async function getEditEquipment(req, res) {
  try {
    const equipment = await EquipmentType.findById(req.params.id).lean();
    if (!equipment) return notFound(res, req.user, `${ENTITY} not found`);
    res.render("equipment/form", { equipment, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}`);
  }
}

async function postEditEquipment(req, res) {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      const equipment = await EquipmentType.findById(req.params.id).lean();
      return res.render("equipment/form", {
        equipment,
        user: req.user,
        error: "Equipment type name is required",
      });
    }

    const existing = await EquipmentType.findOne({
      name: name.trim(),
      _id: { $ne: req.params.id },
    });
    if (existing) {
      const equipment = await EquipmentType.findById(req.params.id).lean();
      return res.render("equipment/form", {
        equipment,
        user: req.user,
        error: "An equipment type with this name already exists",
      });
    }

    await EquipmentType.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      description: description?.trim() || "",
    });

    res.redirect("/equipment");
  } catch (err) {
    serverError(res, req.user, `Failed to update ${ENTITY}`);
  }
}

async function postDeleteEquipment(req, res) {
  try {
    await EquipmentType.findByIdAndDelete(req.params.id);
    res.redirect("/equipment");
  } catch (err) {
    serverError(res, req.user, `Failed to delete ${ENTITY}`);
  }
}

async function getDeleteEquipment(req, res) {
  try {
    const equipment = await EquipmentType.findById(req.params.id).lean();
    if (!equipment) return notFound(res, req.user, `${ENTITY} not found`);
    res.render("confirm-delete", {
      entityName: equipment.name,
      cancelUrl: "/equipment",
      deleteUrl: `/equipment/${req.params.id}/delete`,
      user: req.user,
    });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}`);
  }
}

module.exports = {
  getEquipment,
  getCreateEquipment,
  postCreateEquipment,
  getEditEquipment,
  postEditEquipment,
  postDeleteEquipment,
  getDeleteEquipment,
};
