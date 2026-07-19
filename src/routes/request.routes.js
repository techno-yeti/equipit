const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
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
} = require("../controllers/request.controller");

const router = Router();

router.get(
  "/",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getRequests,
);
router.get(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  getCreateRequest,
);
router.post(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  postCreateRequest,
);
router.get(
  "/:id/view",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getRequestView,
);
router.get(
  "/:id/print",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getRequestPrint,
);
router.get(
  "/:id/fulfill",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getFulfillForm,
);
router.post(
  "/:id/fulfill",
  requireAuth,
  requireRole("admin", "manager", "user"),
  postFulfillRequest,
);
router.get(
  "/:id/dispatch-note",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getEditDispatchNote,
);
router.post(
  "/:id/dispatch-note",
  requireAuth,
  requireRole("admin", "manager", "user"),
  postEditDispatchNote,
);
router.get(
  "/:id/pdf",
  requireAuth,
  requireRole("admin", "manager", "user"),
  getViewPDF,
);

module.exports = router;
