import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  company: { type: String, default: "Unknown company", trim: true },
  location: { type: String, default: "" },
  url: { type: String, required: true, trim: true },
  source: { type: String, default: "Manual" },
  description: { type: String, default: "" },
  skills: { type: [String], default: [] },
  matchScore: { type: Number, min: 0, max: 100, default: 0 },
  matchReasons: { type: [String], default: [] }
}, { timestamps: true });

jobSchema.index({ url: 1 }, { unique: true });
export default mongoose.model("Job", jobSchema);
