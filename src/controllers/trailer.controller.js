const TrailerType = require("../models/TrailerType");
const { getEquipmentTypes } = require("../helpers/formData");
const { parseEquipmentAllocation } = require("../helpers/equipmentParser");
const { serverError, notFound } = require("../helpers/errorResponse");

const ENTITY = "trailer type";

async function getTrailers(req, res) {
  try {
    const trailers = await TrailerType.find()
      .populate("equipments.equipmentType")
      .sort({ label: 1 })
      .lean();
    res.render("trailer/index", { trailers, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}s`);
  }
}

async function getCreateTrailer(req, res) {
  try {
    const equipmentTypes = await getEquipmentTypes();
    res.render("trailer/form", {
      trailer: null,
      equipmentTypes,
      user: req.user,
      error: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load form");
  }
}

async function postCreateTrailer(req, res) {
  try {
    const { label, equipmentType, quantity } = req.body;

    if (!label || !label.trim()) {
      const equipmentTypes = await getEquipmentTypes();
      return res.render("trailer/form", {
        trailer: null,
        equipmentTypes,
        user: req.user,
        error: "Trailer label is required",
      });
    }

    const existing = await TrailerType.findOne({ label: label.trim() });
    if (existing) {
      const equipmentTypes = await getEquipmentTypes();
      return res.render("trailer/form", {
        trailer: null,
        equipmentTypes,
        user: req.user,
        error: "A trailer with this label already exists",
      });
    }

    const equipments = parseEquipmentAllocation(equipmentType, quantity);
    await TrailerType.create({ label: label.trim(), equipments });
    res.redirect("/trailers");
  } catch (err) {
    console.error("Error creating trailer:", err);
    const equipmentTypes = await getEquipmentTypes();
    res.render("trailer/form", {
      trailer: null,
      equipmentTypes,
      user: req.user,
      error: `Failed to create ${ENTITY}`,
    });
  }
}

async function getEditTrailer(req, res) {
  try {
    const trailer = await TrailerType.findById(req.params.id)
      .populate("equipments.equipmentType")
      .lean();
    if (!trailer) return notFound(res, req.user, `${ENTITY} not found`);
    const equipmentTypes = await getEquipmentTypes();
    res.render("trailer/form", {
      trailer,
      equipmentTypes,
      user: req.user,
      error: null,
    });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}`);
  }
}

async function postEditTrailer(req, res) {
  try {
    const { label, equipmentType, quantity } = req.body;

    if (!label || !label.trim()) {
      const [equipmentTypes, trailer] = await Promise.all([
        getEquipmentTypes(),
        TrailerType.findById(req.params.id).lean(),
      ]);
      return res.render("trailer/form", {
        trailer,
        equipmentTypes,
        user: req.user,
        error: "Trailer label is required",
      });
    }

    const existing = await TrailerType.findOne({
      label: label.trim(),
      _id: { $ne: req.params.id },
    });
    if (existing) {
      const [equipmentTypes, trailer] = await Promise.all([
        getEquipmentTypes(),
        TrailerType.findById(req.params.id).lean(),
      ]);
      return res.render("trailer/form", {
        trailer,
        equipmentTypes,
        user: req.user,
        error: "A trailer with this label already exists",
      });
    }

    const equipments = parseEquipmentAllocation(equipmentType, quantity);
    await TrailerType.findByIdAndUpdate(req.params.id, {
      label: label.trim(),
      equipments,
    });
    res.redirect("/trailers");
  } catch (err) {
    serverError(res, req.user, `Failed to update ${ENTITY}`);
  }
}

async function postDeleteTrailer(req, res) {
  try {
    await TrailerType.findByIdAndDelete(req.params.id);
    res.redirect("/trailers");
  } catch (err) {
    serverError(res, req.user, `Failed to delete ${ENTITY}`);
  }
}

module.exports = {
  getTrailers,
  getCreateTrailer,
  postCreateTrailer,
  getEditTrailer,
  postEditTrailer,
  postDeleteTrailer,
};
