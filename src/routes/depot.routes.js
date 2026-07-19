const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  getDepots,
  getCreateDepot,
  postCreateDepot,
  postDeleteDepot,
  getDeleteDepot,
} = require("../controllers/depot.controller");

const router = Router();

router.get("/", requireAuth, requireRole("admin", "manager"), getDepots);
router.get("/create", requireAuth, requireRole("admin"), getCreateDepot);
router.post("/create", requireAuth, requireRole("admin"), postCreateDepot);
router.post("/:id/delete", requireAuth, requireRole("admin"), postDeleteDepot);
router.get("/:id/delete", requireAuth, requireRole("admin"), getDeleteDepot);

module.exports = router;
