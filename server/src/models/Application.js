import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  status: {
    type: String,
    enum: ["discovered", "analyzed", "pending_approval", "applied", "interview", "rejected", "withdrawn"],
    default: "discovered"
  },
  notes: { type: String, default: "" },
  appliedAt: { type: Date, default: null }
}, { timestamps: true });

applicationSchema.index({ job: 1 }, { unique: true });
export default mongoose.model("Application", applicationSchema);
