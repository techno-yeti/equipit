const User = require("../models/User");
const DepotSite = require("../models/DepotSite");
const AppConfig = require("../models/AppConfig");
const { serverError, notFound } = require("../helpers/errorResponse");

async function getUsers(req, res) {
  try {
    const [users, depots] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      DepotSite.find().sort({ name: 1 }).lean(),
    ]);
    res.render("admin/users", {
      users,
      depots,
      user: req.user,
      error: null,
      success: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load users");
  }
}

async function postApproveUser(req, res) {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.redirect("/admin/users");
  } catch (err) {
    serverError(res, req.user, "Failed to approve user");
  }
}

async function postDenyUser(req, res) {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "denied" });
    res.redirect("/admin/users");
  } catch (err) {
    serverError(res, req.user, "Failed to deny user");
  }
}

async function postDeleteUser(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/admin/users");
  } catch (err) {
    serverError(res, req.user, "Failed to delete user");
  }
}

async function getDeleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return notFound(res, req.user, "User not found");
    res.render("confirm-delete", {
      entityName: `${user.name} (${user.email})`,
      cancelUrl: "/admin/users",
      deleteUrl: `/admin/users/${req.params.id}/delete`,
      user: req.user,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load user");
  }
}

async function postUpdateRole(req, res) {
  try {
    const { role, depotSite } = req.body;
    if (!["admin", "manager", "user", "security"].includes(role)) {
      return res.redirect("/admin/users");
    }
    await User.findByIdAndUpdate(req.params.id, {
      role,
      depotSite: depotSite || null,
    });
    res.redirect("/admin/users");
  } catch (err) {
    serverError(res, req.user, "Failed to update role");
  }
}

async function getConfig(req, res) {
  try {
    const cfg = await AppConfig.findOne({ key: "allowedDomains" }).lean();
    const domains = cfg?.value || [];
    res.render("admin/config", {
      domains,
      user: req.user,
      error: null,
      success: null,
    });
  } catch (err) {
    serverError(res, req.user, "Failed to load configuration");
  }
}

async function postConfig(req, res) {
  try {
    const { domains } = req.body;
    const domainList = domains
      ? domains
          .split("\n")
          .map((d) => d.trim())
          .filter(Boolean)
      : [];

    await AppConfig.findOneAndUpdate(
      { key: "allowedDomains" },
      { key: "allowedDomains", value: domainList },
      { upsert: true },
    );

    res.render("admin/config", {
      domains: domainList,
      user: req.user,
      error: null,
      success: "Configuration saved successfully",
    });
  } catch (err) {
    serverError(res, req.user, "Failed to save configuration");
  }
}

module.exports = {
  getUsers,
  postApproveUser,
  postDenyUser,
  postDeleteUser,
  getDeleteUser,
  postUpdateRole,
  getConfig,
  postConfig,
};
