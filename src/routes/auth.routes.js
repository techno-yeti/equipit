const { Router } = require("express");
const rateLimit = require("express-rate-limit");
const {
  getLogin,
  getRegister,
  postRegister,
  postLogin,
  getLogout,
} = require("../controllers/auth.controller");

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many authentication attempts, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

router.get("/login", authLimiter, getLogin);
router.get("/register", authLimiter, getRegister);
router.post("/register", authLimiter, postRegister);
router.post("/login", authLimiter, postLogin);
router.get("/logout", getLogout);

module.exports = router;
