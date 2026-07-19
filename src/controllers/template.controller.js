const Template = require("../models/Template");
const { getEquipmentTypes } = require("../helpers/formData");
const { parseEquipmentAllocation } = require("../helpers/equipmentParser");
const { serverError, notFound } = require("../helpers/errorResponse");

const ENTITY = "template";

async function getTemplates(req, res) {
  try {
    const templates = await Template.find()
      .populate("equipments.equipmentType")
      .sort({ name: 1 })
      .lean();
    res.render("template/index", { templates, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}s`);
  }
}

async function getCreateTemplate(req, res) {
  try {
    const equipmentTypes = await getEquipmentTypes();
    res.render("template/form", {
      template: null,
      equipmentTypes,
      user: req.user,
      error: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load form");
  }
}

async function postCreateTemplate(req, res) {
  try {
    const { name, supplier, equipmentType, quantity } = req.body;

    if (!name || !name.trim()) {
      const equipmentTypes = await getEquipmentTypes();
      return res.render("template/form", {
        template: null,
        equipmentTypes,
        user: req.user,
        error: "Template name is required",
      });
    }

    const equipments = parseEquipmentAllocation(equipmentType, quantity);
    await Template.create({
      name: name.trim(),
      supplier: supplier?.trim() || "",
      equipments,
    });
    res.redirect("/templates");
  } catch (err) {
    console.error("Error creating template:", err);
    const equipmentTypes = await getEquipmentTypes();
    res.render("template/form", {
      template: null,
      equipmentTypes,
      user: req.user,
      error: `Failed to create ${ENTITY}`,
    });
  }
}

async function getEditTemplate(req, res) {
  try {
    const template = await Template.findById(req.params.id)
      .populate("equipments.equipmentType")
      .lean();
    if (!template) return notFound(res, req.user, `${ENTITY} not found`);
    const equipmentTypes = await getEquipmentTypes();
    res.render("template/form", {
      template,
      equipmentTypes,
      user: req.user,
      error: null,
    });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}`);
  }
}

async function postEditTemplate(req, res) {
  try {
    const { name, supplier, equipmentType, quantity } = req.body;

    if (!name || !name.trim()) {
      const [equipmentTypes, template] = await Promise.all([
        getEquipmentTypes(),
        Template.findById(req.params.id).lean(),
      ]);
      return res.render("template/form", {
        template,
        equipmentTypes,
        user: req.user,
        error: "Template name is required",
      });
    }

    const equipments = parseEquipmentAllocation(equipmentType, quantity);
    await Template.findByIdAndUpdate(req.params.id, {
      name: name.trim(),
      supplier: supplier?.trim() || "",
      equipments,
    });

    res.redirect("/templates");
  } catch (err) {
    serverError(res, req.user, `Failed to update ${ENTITY}`);
  }
}

async function postDeleteTemplate(req, res) {
  try {
    await Template.findByIdAndDelete(req.params.id);
    res.redirect("/templates");
  } catch (err) {
    serverError(res, req.user, `Failed to delete ${ENTITY}`);
  }
}

async function getDeleteTemplate(req, res) {
  try {
    const template = await Template.findById(req.params.id).lean();
    if (!template) return notFound(res, req.user, `${ENTITY} not found`);
    res.render("confirm-delete", {
      entityName: template.name,
      cancelUrl: "/templates",
      deleteUrl: `/templates/${req.params.id}/delete`,
      user: req.user,
    });
  } catch (err) {
    serverError(res, req.user, `Failed to load ${ENTITY}`);
  }
}

module.exports = {
  getTemplates,
  getCreateTemplate,
  postCreateTemplate,
  getEditTemplate,
  postEditTemplate,
  postDeleteTemplate,
  getDeleteTemplate,
};
