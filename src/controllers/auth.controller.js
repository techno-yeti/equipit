const jwt = require("jsonwebtoken");
const config = require("../config/env");
const User = require("../models/User");
const DepotSite = require("../models/DepotSite");
const AppConfig = require("../models/AppConfig");

function renderLogin(res, error) {
  res.render("login", { error, user: null });
}

async function getDepotSites() {
  return DepotSite.find().lean();
}

async function getRegister(req, res) {
  if (req.user) return res.redirect("/dashboard");

  const [userCount, depotSites] = await Promise.all([
    User.countDocuments(),
    getDepotSites(),
  ]);

  res.render("register", {
    error: null,
    user: null,
    isFirstUser: userCount === 0,
    depotSites,
  });
}

async function getAllowedDomains() {
  const cfg = await AppConfig.findOne({ key: "allowedDomains" }).lean();
  return cfg?.value || [];
}

async function postRegister(req, res) {
  try {
    const { name, email, password, confirmPassword, depotSite } = req.body;

    const depotSites = await getDepotSites();
    const renderError = async (error, opts = {}) => {
      const sites = opts.depotSites || depotSites;
      const isFirst = opts.isFirstUser !== undefined ? opts.isFirstUser : false;
      res.render("register", {
        error,
        user: null,
        isFirstUser: isFirst,
        depotSites: sites,
      });
    };

    if (!name || !email || !password || !confirmPassword) {
      return renderError("All fields are required");
    }

    if (password !== confirmPassword) {
      return renderError("Passwords do not match");
    }

    if (password.length < 8) {
      return renderError("Password must be at least 8 characters");
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return renderError("Email already registered");
    }

    const [userCount, adminExists] = await Promise.all([
      User.countDocuments(),
      User.findOne({ role: "admin" }).lean(),
    ]);
    const isAdminSetup = !adminExists;
    const isFirstUser = userCount === 0;

    if (!isAdminSetup) {
      const allowedDomains = await getAllowedDomains();
      if (allowedDomains.length > 0) {
        const emailDomain = email.split("@")[1]?.toLowerCase();
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
          return renderError(
            "Registration is restricted to specific email domains. Contact your administrator.",
          );
        }
      }
    }

    const role = isAdminSetup ? "admin" : "user";
    const status = isAdminSetup ? "approved" : "pending";

    if (isAdminSetup && !req.body.depotSiteName) {
      return renderError("You must specify the first depot site name", {
        isFirstUser: true,
        depotSites: [],
      });
    }

    let depotSiteId = depotSite || null;

    if (isAdminSetup) {
      const newDepot = await DepotSite.create({
        name: req.body.depotSiteName,
        createdBy: null,
        isFirstSite: true,
      });
      depotSiteId = newDepot._id;
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      passwordHash: password,
      role,
      status,
      depotSite: depotSiteId,
    });
    await user.save();

    if (isAdminSetup && depotSiteId) {
      await DepotSite.findByIdAndUpdate(depotSiteId, { createdBy: user._id });
    }

    if (isAdminSetup) {
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresIn,
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: config.isProduction,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect("/dashboard");
    }

    renderLogin(
      res,
      "Registration successful! Your account is pending approval from an administrator.",
    );
  } catch (err) {
    console.error("Registration error:", err);
    const currentUserCount = await User.countDocuments();
    const currentDepotSites = currentUserCount > 0 ? await getDepotSites() : [];
    res.render("register", {
      error: "Registration failed. Please try again.",
      user: null,
      isFirstUser: currentUserCount === 0,
      depotSites: currentDepotSites,
    });
  }
}

async function postLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return renderLogin(res, "Email and password are required");
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return renderLogin(res, "Invalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return renderLogin(res, "Invalid email or password");
    }

    if (user.status === "pending") {
      return renderLogin(
        res,
        "Your account is pending approval from an administrator.",
      );
    }

    if (user.status === "denied") {
      return renderLogin(
        res,
        "Your account has been denied. Contact an administrator.",
      );
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.isProduction,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    if (user.role === "security") return res.redirect("/dispatch");
    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    renderLogin(res, "Login failed. Please try again.");
  }
}

function getLogin(req, res) {
  if (req.user) return res.redirect("/dashboard");
  renderLogin(res, null);
}

function getLogout(req, res) {
  res.clearCookie("token");
  res.redirect("/login");
}

module.exports = { getLogin, getRegister, postRegister, postLogin, getLogout };
