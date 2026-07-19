const { Router } = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const { getHelp } = require("../controllers/help.controller");

const router = Router();

router.get("/", getHelp);

module.exports = router;
