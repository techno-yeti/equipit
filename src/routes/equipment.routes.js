const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getEquipment,
  getCreateEquipment,
  postCreateEquipment,
  getEditEquipment,
  postEditEquipment,
  postDeleteEquipment,
  getDeleteEquipment,
} = require("../controllers/equipment.controller");

const router = Router();

router.get("/", requireAuth, getEquipment);
router.get(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  getCreateEquipment,
);
router.post(
  "/create",
  requireAuth,
  requireRole("admin", "manager"),
  postCreateEquipment,
);
router.get(
  "/:id/edit",
  requireAuth,
  requireRole("admin", "manager"),
  getEditEquipment,
);
router.post(
  "/:id/edit",
  requireAuth,
  requireRole("admin", "manager"),
  postEditEquipment,
);
router.post(
  "/:id/delete",
  requireAuth,
  requireRole("admin", "manager"),
  postDeleteEquipment,
);
router.get(
  "/:id/delete",
  requireAuth,
  requireRole("admin", "manager"),
  getDeleteEquipment,
);

module.exports = router;
