import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import profileRoutes from "./routes/profileRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

const app = express();
app.use(cors({
  origin(origin, callback) {
    // Local dashboard plus this user's installed extension origin.
    if (!origin || origin === (process.env.CLIENT_ORIGIN || "http://localhost:5173") || origin.startsWith("chrome-extension://")) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  }
}));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "jobpilot-api" }));
app.use("/api/profile", profileRoutes);
app.use("/api/jobs", jobRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: "This job/application already exists" });
  res.status(500).json({ message: "Server error" });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`JobPilot API listening on ${port}`)))
  .catch(error => { console.error("Startup failed:", error); process.exit(1); });
