const DepotSite = require("../models/DepotSite");
const { serverError, notFound } = require("../helpers/errorResponse");

async function getDepots(req, res) {
  try {
    const depots = await DepotSite.find()
      .populate("createdBy", "name email")
      .sort({ name: 1 })
      .lean();
    res.render("depot/index", { depots, user: req.user, error: null });
  } catch (err) {
    serverError(res, req.user, "Failed to load depot sites");
  }
}

function getCreateDepot(req, res) {
  res.render("depot/form", { depot: null, user: req.user, error: null });
}

async function postCreateDepot(req, res) {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.render("depot/form", {
        depot: null,
        user: req.user,
        error: "Depot site name is required",
      });
    }

    const existing = await DepotSite.findOne({ name: name.trim() });
    if (existing) {
      return res.render("depot/form", {
        depot: null,
        user: req.user,
        error: "A depot site with this name already exists",
      });
    }

    await DepotSite.create({ name: name.trim(), createdBy: req.user._id });
    res.redirect("/depots");
  } catch (err) {
    console.error("Error creating depot:", err);
    res.render("depot/form", {
      depot: null,
      user: req.user,
      error: "Failed to create depot site",
    });
  }
}

async function postDeleteDepot(req, res) {
  try {
    const depot = await DepotSite.findById(req.params.id);
    if (!depot) return notFound(res, req.user, "Depot site not found");
    if (depot.isFirstSite) {
      return res.status(403).render("error", {
        message: "The first depot site cannot be deleted.",
        user: req.user,
      });
    }
    await DepotSite.findByIdAndDelete(req.params.id);
    res.redirect("/depots");
  } catch (err) {
    serverError(res, req.user, "Failed to delete depot site");
  }
}

async function getDeleteDepot(req, res) {
  try {
    const depot = await DepotSite.findById(req.params.id).lean();
    if (!depot) return notFound(res, req.user, "Depot site not found");
    if (depot.isFirstSite) {
      return res.status(403).render("error", {
        message: "The first depot site cannot be deleted.",
        user: req.user,
      });
    }
    res.render("confirm-delete", {
      entityName: depot.name,
      cancelUrl: "/depots",
      deleteUrl: `/depots/${req.params.id}/delete`,
      user: req.user,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load depot site");
  }
}

module.exports = {
  getDepots,
  getCreateDepot,
  postCreateDepot,
  postDeleteDepot,
  getDeleteDepot,
};
