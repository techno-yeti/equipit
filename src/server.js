const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");

const config = require("./config/env");
const connectDB = require("./config/db");
const { securityHeaders } = require("./config/security");
const { extractUser } = require("./middleware/auth");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/auth.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const equipmentRoutes = require("./routes/equipment.routes");

const templateRoutes = require("./routes/template.routes");
const requestRoutes = require("./routes/request.routes");
const depotRoutes = require("./routes/depot.routes");
const dispatchRoutes = require("./routes/dispatch.routes");
const adminRoutes = require("./routes/admin.routes");
const helpRoutes = require("./routes/help.routes");

const app = express();

if (!config.isTest) {
  connectDB();
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(securityHeaders);

app.use(
  cors({
    origin: config.corsAllowedOrigins,
    credentials: true,
  }),
);

if (config.isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(extractUser);

app.get("/", (req, res) => {
  if (req.user) {
    if (req.user.role === "security") return res.redirect("/dispatch");
    return res.redirect("/dashboard");
  }
  res.render("index", { user: null });
});

app.use(authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/equipment", equipmentRoutes);
app.use("/templates", templateRoutes);
app.use("/requests", requestRoutes);
app.use("/depots", depotRoutes);
app.use("/dispatch", dispatchRoutes);
app.use("/admin", adminRoutes);
app.use("/help", helpRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/cors-origins", (req, res) => {
  res.json({ origins: config.corsAllowedOrigins });
});

app.use(notFoundHandler);
app.use(errorHandler);

if (!config.isTest) {
  app.listen(config.port, () => {
    console.log(
      `Equipit server running on port ${config.port} in ${config.env} mode`,
    );
    console.log(`App URL: ${config.appBaseUrl}`);
  });
}

module.exports = app;
