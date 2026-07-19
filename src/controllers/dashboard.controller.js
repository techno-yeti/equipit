const Request = require("../models/Request");
const Template = require("../models/Template");
const { generateRequestNumber } = require("../services/requestNumber.service");
const { parseEquipmentAllocation } = require("../helpers/equipmentParser");
const { getFormData } = require("../helpers/formData");
const { requestPopulate } = require("../services/requestQueries");
const { serverError } = require("../helpers/errorResponse");

async function getDashboard(req, res) {
  try {
    const today = new Date();
    const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const filterDate = req.query.date || localDate;
    const search = req.query.search || "";
    const startOfDay = new Date(filterDate + "T00:00:00.000Z");
    const endOfDay = new Date(filterDate + "T23:59:59.999Z");

    const plannedQuery = {
      plannedDate: { $gte: startOfDay, $lte: endOfDay },
    };
    if (search) {
      plannedQuery.requestNumber = new RegExp(
        "^" + search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i",
      );
    }

    const [requests, { templates, equipmentTypes, depotSites }] =
      await Promise.all([
        Request.find(plannedQuery)
          .populate(requestPopulate)
          .sort({ plannedDate: -1, createdAt: -1 })
          .lean(),
        getFormData(),
      ]);

    const [total, pending, fulfilled, dispatched] = await Promise.all([
      Request.countDocuments(),
      Request.countDocuments({ status: "pending" }),
      Request.countDocuments({ status: "fulfilled" }),
      Request.countDocuments({ status: "dispatched" }),
    ]);

    res.render("dashboard/index", {
      requests,
      templates,
      equipmentTypes,
      depotSites,
      stats: { total, pending, fulfilled, dispatched },
      user: req.user,
      error: null,
      filterDate,
      search,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load dashboard");
  }
}

async function postQuickRequest(req, res) {
  try {
    const {
      template,
      supplier,
      equipmentType,
      quantity,
      depotSite,
      requestNumber,
    } = req.body;

    let finalRequestNumber = requestNumber;
    if (!finalRequestNumber || !finalRequestNumber.trim()) {
      finalRequestNumber = await generateRequestNumber();
    } else {
      if (!/^[A-Za-z0-9]{8}$/.test(finalRequestNumber.trim())) {
        return res.redirect("/dashboard?error=invalid-number");
      }
      const exists = await Request.findOne({
        requestNumber: finalRequestNumber.trim(),
      });
      if (exists) return res.redirect("/dashboard?error=number-exists");
    }

    let supplierName = supplier?.trim() || "";
    let equipments = [];

    if (template) {
      const selectedTemplate = await Template.findById(template)
        .populate("equipments.equipmentType")
        .lean();
      if (selectedTemplate) {
        equipments = selectedTemplate.equipments.map((e) => ({
          equipmentType: e.equipmentType._id,
          quantity: e.quantity,
        }));
        if (!supplierName) supplierName = selectedTemplate.supplier || "";
      }
    }

    if (equipmentType) {
      equipments = parseEquipmentAllocation(equipmentType, quantity);
    }

    if (equipments.length === 0)
      return res.redirect("/dashboard?error=no-equipment");

    await Request.create({
      requestNumber: finalRequestNumber.trim().toUpperCase(),
      template: template || null,
      supplier: supplierName,
      equipments,
      depotSite: depotSite || null,
      createdBy: req.user._id,
      status: "pending",
    });

    res.redirect("/dashboard?success=created");
  } catch (err) {
    console.error("Error creating quick request:", err);
    res.redirect("/dashboard?error=creation-failed");
  }
}

module.exports = { getDashboard, postQuickRequest };
