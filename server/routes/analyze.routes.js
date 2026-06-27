const router = require("express").Router();
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../middlewares/auth.middleware");
const analyzeController = require("../controllers/analyze.controller");

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  analyzeController.analyze
);

router.get("/history", authMiddleware, analyzeController.getHistory);


router.delete("/history/:id", authMiddleware, analyzeController.deleteHistory);

module.exports = router;