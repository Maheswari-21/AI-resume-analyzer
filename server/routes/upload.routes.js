const router = require("express").Router();
const upload = require("../middlewares/upload.middleware");

router.post("/", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    message: "File uploaded successfully",
    storedName: req.file.filename,
    originalName: req.file.originalname
  });
});

module.exports = router;