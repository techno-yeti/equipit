const path = require("path");
const Request = require("../models/Request");
const Template = require("../models/Template");
const User = require("../models/User");
const EquipmentType = require("../models/EquipmentType");
const { generateRequestNumber } = require("../services/requestNumber.service");
const { generateRequestPDF } = require("../services/pdf.service");
const {
  findAllRequests,
  findRequestById,
} = require("../services/requestQueries");
const { getValidFormData } = require("../helpers/formData");
const { serverError, notFound } = require("../helpers/errorResponse");

async function getRequests(req, res) {
  try {
    const search = req.query.search || "";
    const statusFilter = req.query.status || "";
    const filters = {};
    if (search) filters.search = search;
    if (statusFilter) filters.status = statusFilter;
    const requests = await findAllRequests(filters);
    res.render("request/index", {
      requests,
      user: req.user,
      error: null,
      search,
      statusFilter,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load requests");
  }
}

async function getCreateRequest(req, res) {
  try {
    const data = await getValidFormData();
    res.render("request/form", {
      request: null,
      ...data,
      user: req.user,
      error: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load form");
  }
}

async function postCreateRequest(req, res) {
  try {
    const { template, supplier, depotSite, requestNumber, plannedDate } =
      req.body;

    let finalRequestNumber = requestNumber;

    const renderError = async (message) => {
      const data = await getValidFormData();
      res.render("request/form", {
        ...data,
        request: null,
        user: req.user,
        error: message,
      });
    };

    if (!finalRequestNumber || !finalRequestNumber.trim()) {
      finalRequestNumber = await generateRequestNumber();
    } else {
      if (!/^[A-Za-z0-9]{8}$/.test(finalRequestNumber.trim())) {
        return renderError(
          "Request number must be exactly 8 alphanumeric characters",
        );
      }

      const exists = await Request.findOne({
        requestNumber: finalRequestNumber.trim(),
      });
      if (exists) {
        return renderError("Request number already exists");
      }
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

    if (equipments.length === 0) {
      return renderError("A template with equipment items is required");
    }

    await Request.create({
      requestNumber: finalRequestNumber.trim().toUpperCase(),
      template: template || null,
      supplier: supplierName,
      equipments,
      depotSite: depotSite || null,
      createdBy: req.user._id,
      status: "pending",
      plannedDate: plannedDate || null,
    });

    res.redirect("/requests");
  } catch (err) {
    console.error("Error creating request:", err);
    const data = await getValidFormData();
    res.render("request/form", {
      ...data,
      request: null,
      user: req.user,
      error: "Failed to create request",
    });
  }
}

async function getRequestView(req, res) {
  try {
    const request = await findRequestById(req.params.id);
    if (!request) return notFound(res, req.user, "Request not found");
    res.render("request/view", { request, user: req.user });
  } catch (err) {
    serverError(res, req.user, "Failed to load request");
  }
}

async function getRequestPrint(req, res) {
  try {
    const request = await findRequestById(req.params.id);
    if (!request) return notFound(res, req.user, "Request not found");
    res.render("request/print", { request, user: req.user });
  } catch (err) {
    serverError(res, req.user, "Failed to load request");
  }
}

async function getFulfillForm(req, res) {
  try {
    const request = await Request.findById(req.params.id)
      .populate("equipments.equipmentType")
      .populate("template", "name")
      .populate("depotSite", "name")
      .populate("createdBy", "name")
      .lean();

    if (!request) return notFound(res, req.user, "Request not found");
    if (request.status !== "pending") return res.redirect("/requests");

    res.render("request/fulfill", { request, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, "Failed to load fulfill form");
  }
}

async function postFulfillRequest(req, res) {
  try {
    const { boxNumber, bayNumber, fulfillmentDate } = req.body;
    const request = await Request.findById(req.params.id)
      .populate("equipments.equipmentType")
      .populate("template", "name")
      .populate("depotSite", "name")
      .lean();

    if (!request) return notFound(res, req.user, "Request not found");

    if (request.status !== "pending") return res.redirect("/requests");

    const trimmedBox = (boxNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");
    const trimmedBay = (bayNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");

    if (!trimmedBox || !trimmedBay) {
      return res.render("request/fulfill", {
        request,
        user: req.user,
        error: "Both Box Number and Bay Number are required before fulfilling.",
      });
    }

    const [equipmentTypes, createdByUser] = await Promise.all([
      EquipmentType.find().lean(),
      User.findById(request.createdBy).lean(),
    ]);

    const { filePath } = await generateRequestPDF(
      request,
      equipmentTypes,
      createdByUser,
      req.user,
      request.depotSite,
      trimmedBox,
      trimmedBay,
      fulfillmentDate,
    );

    await Request.findByIdAndUpdate(req.params.id, {
      status: "fulfilled",
      pdfPath: filePath,
      fulfilledBy: req.user._id,
      boxNumber: trimmedBox,
      bayNumber: trimmedBay,
      fulfillmentDate: fulfillmentDate || null,
    });
    res.redirect("/requests");
  } catch (err) {
    console.error("Error fulfilling request:", err);
    serverError(res, req.user, "Failed to fulfill request");
  }
}

async function getEditDispatchNote(req, res) {
  try {
    const request = await findRequestById(req.params.id);
    if (!request) return notFound(res, req.user, "Request not found");
    if (request.status === "pending" || request.status === "dispatched")
      return res.redirect("/requests");
    res.render("request/edit-dispatch-note", {
      request,
      user: req.user,
      error: null,
      success: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load dispatch note editor");
  }
}

async function postEditDispatchNote(req, res) {
  try {
    const { boxNumber, bayNumber, dispatchNote } = req.body;
    const request = await Request.findById(req.params.id)
      .populate("equipments.equipmentType")
      .populate("template", "name")
      .populate("depotSite", "name")
      .lean();

    if (!request) return notFound(res, req.user, "Request not found");
    if (request.status === "pending" || request.status === "dispatched")
      return res.redirect("/requests");

    const trimmedBox = (boxNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");
    const trimmedBay = (bayNumber || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9-]/g, "");
    const trimmedNote = (dispatchNote || "").trim();

    const [equipmentTypes, createdByUser] = await Promise.all([
      EquipmentType.find().lean(),
      User.findById(request.createdBy).lean(),
    ]);

    const { filePath } = await generateRequestPDF(
      request,
      equipmentTypes,
      createdByUser,
      req.user,
      request.depotSite,
      trimmedBox,
      trimmedBay,
      request.fulfillmentDate,
    );

    await Request.findByIdAndUpdate(req.params.id, {
      boxNumber: trimmedBox,
      bayNumber: trimmedBay,
      dispatchNote: trimmedNote,
      pdfPath: filePath,
    });

    res.render("request/edit-dispatch-note", {
      request: {
        ...request,
        boxNumber: trimmedBox,
        bayNumber: trimmedBay,
        dispatchNote: trimmedNote,
        pdfPath: filePath,
      },
      user: req.user,
      error: null,
      success: "Dispatch details updated successfully.",
    });
  } catch (err) {
    serverError(res, req.user, "Failed to update dispatch details");
  }
}

async function getViewPDF(req, res) {
  try {
    const request = await Request.findById(req.params.id).lean();
    if (!request || !request.pdfPath)
      return notFound(res, req.user, "PDF not found");
    const filename = path.basename(request.pdfPath);
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.sendFile(request.pdfPath);
  } catch (err) {
    serverError(res, req.user, "Failed to view PDF");
  }
}

module.exports = {
  getRequests,
  getCreateRequest,
  postCreateRequest,
  getRequestView,
  getRequestPrint,
  getFulfillForm,
  postFulfillRequest,
  getEditDispatchNote,
  postEditDispatchNote,
  getViewPDF,
};
