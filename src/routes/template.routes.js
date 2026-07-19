const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getTemplates,
  getCreateTemplate,
  postCreateTemplate,
  getEditTemplate,
  postEditTemplate,
  postDeleteTemplate,
  getDeleteTemplate,
} = require("../controllers/template.controller");

const router = Router();

router.get("/", requireAuth, getTemplates);
router.get(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  getCreateTemplate,
);
router.post(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  postCreateTemplate,
);
router.get(
  "/:id/edit",
  requireAuth,
  requireRole("admin", "manager"),
  getEditTemplate,
);
router.post(
  "/:id/edit",
  requireAuth,
  requireRole("admin", "manager"),
  postEditTemplate,
);
router.post(
  "/:id/delete",
  requireAuth,
  requireRole("admin", "manager"),
  postDeleteTemplate,
);
router.get(
  "/:id/delete",
  requireAuth,
  requireRole("admin", "manager"),
  getDeleteTemplate,
);

module.exports = router;
