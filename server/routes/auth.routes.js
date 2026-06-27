const router = require("express").Router();

const auth = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { loginLimiter } = require("../middlewares/rateLimiter");  
const analyzeController = require("../controllers/analyze.controller");
router.post("/register", auth.register);

router.post("/login", loginLimiter, auth.login);

router.post("/refresh", auth.refreshToken);
router.post("/logout", authMiddleware, auth.logout);
router.get(
  "/history",
  authMiddleware,
  analyzeController.getHistory
);
router.get("/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});

module.exports = router;