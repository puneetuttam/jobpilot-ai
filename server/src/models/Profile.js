import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  fullName: { type: String, trim: true, default: "" },
  email: { type: String, trim: true, lowercase: true, default: "" },
  experienceYears: { type: Number, min: 0, default: 4.5 },
  currentTitle: { type: String, default: "Software Engineer" },
  skills: { type: [String], default: ["React", "JavaScript", "Node.js", "Java", "Spring Boot"] },
  preferredRoles: { type: [String], default: ["Java Full Stack Developer", "React Full Stack Developer"] },
  preferredLocations: { type: [String], default: ["Bengaluru", "Pune", "Hyderabad"] },
  expectedCtcLpa: { type: Number, min: 0, default: 14 },
  resumeText: { type: String, default: "" }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);
