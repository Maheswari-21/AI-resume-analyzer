const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const analyzeRoutes = require("./routes/analyze.routes");
const uploadRoutes = require("./routes/upload.routes"); 
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(cors({
    origin: [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://ai-resume-analyzer-two-beryl.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/upload", uploadRoutes); 

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK" });
});

app.use(errorHandler);

module.exports = app;