exports.validateAnalyze = (req, res, next) => {
  if (!req.body.jobDescription) {
    return res.status(400).json({ error: "Job description required" });
  }
  next();
};