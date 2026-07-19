const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getUsers,
  postApproveUser,
  postDenyUser,
  postDeleteUser,
  getDeleteUser,
  postUpdateRole,
  getConfig,
  postConfig,
} = require("../controllers/admin.controller");

const router = Router();

router.get("/users", requireAuth, requireRole("admin"), getUsers);
router.post(
  "/users/:id/approve",
  requireAuth,
  requireRole("admin"),
  postApproveUser,
);
router.post("/users/:id/deny", requireAuth, requireRole("admin"), postDenyUser);
router.post(
  "/users/:id/delete",
  requireAuth,
  requireRole("admin"),
  postDeleteUser,
);
router.get(
  "/users/:id/delete",
  requireAuth,
  requireRole("admin"),
  getDeleteUser,
);
router.post(
  "/users/:id/role",
  requireAuth,
  requireRole("admin"),
  postUpdateRole,
);
router.get("/config", requireAuth, requireRole("admin"), getConfig);
router.post("/config", requireAuth, requireRole("admin"), postConfig);

module.exports = router;
