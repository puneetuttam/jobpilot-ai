import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Profile from "../models/Profile.js";
import { scoreJob } from "../services/matchService.js";
import { prepareJobApplication } from "../services/platformService.js";

export async function createJob(req, res, next) {
  try {
    const { title, url } = req.body;
    if (!title?.trim() || !url?.trim()) return res.status(400).json({ message: "Job title and URL are required" });
    let parsed;
    try { parsed = new URL(url); } catch { return res.status(400).json({ message: "A valid job URL is required" }); }
    if (!["http:", "https:"].includes(parsed.protocol)) return res.status(400).json({ message: "Only HTTP(S) job URLs are supported" });

    const profile = await Profile.findOne() || await Profile.create({});
    const draft = { ...req.body, title: title.trim(), url: parsed.toString() };
    const match = scoreJob(draft, profile);
    const job = await Job.findOneAndUpdate(
      { url: draft.url },
      { $set: { ...draft, matchScore: match.score, matchReasons: match.reasons, skills: match.matchedSkills } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    await Application.findOneAndUpdate(
      { job: job._id },
      { $setOnInsert: { job: job._id, status: "analyzed" } },
      { upsert: true, new: true }
    );
    res.status(201).json(job);
  } catch (error) { next(error); }
}

export async function listJobs(_req, res, next) {
  try { res.json(await Job.find().sort({ matchScore: -1, createdAt: -1 }).limit(100)); }
  catch (error) { next(error); }
}

export async function getJob(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (error) { next(error); }
}

export async function updateStatus(req, res, next) {
  try {
    const allowed = ["discovered", "analyzed", "pending_approval", "applied", "interview", "rejected", "withdrawn"];
    if (!allowed.includes(req.body.status)) return res.status(400).json({ message: "Invalid status" });
    const application = await Application.findOneAndUpdate(
      { job: req.params.id },
      { $set: { status: req.body.status, notes: req.body.notes || "", appliedAt: req.body.status === "applied" ? new Date() : null } },
      { new: true, upsert: true, runValidators: true }
    ).populate("job");
    res.json(application);
  } catch (error) { next(error); }
}

export async function listApplications(_req, res, next) {
  try { res.json(await Application.find().populate("job").sort({ updatedAt: -1 })); }
  catch (error) { next(error); }
}

export async function prepareApplication(req, res, next) {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    const profile = await Profile.findOne();
    if (!profile) return res.status(400).json({ message: "Create a candidate profile first" });
    const result = await prepareJobApplication({ job: job.toObject(), profile: profile.toObject() });
    await Application.findOneAndUpdate(
      { job: job._id },
      { $set: { status: "pending_approval" }, $setOnInsert: { job: job._id } },
      { upsert: true, new: true }
    );
    res.json(result);
  } catch (error) { next(error); }
}
