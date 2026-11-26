import Profile from "../models/Profile.js";

export async function getProfile(_req, res, next) {
  try {
    const profile = await Profile.findOneAndUpdate({}, {}, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json(profile);
  } catch (error) { next(error); }
}

export async function saveProfile(req, res, next) {
  try {
    const allowed = ["fullName", "email", "experienceYears", "currentTitle", "skills", "preferredRoles", "preferredLocations", "expectedCtcLpa", "resumeText"];
    const update = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    const profile = await Profile.findOneAndUpdate({}, update, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    res.json(profile);
  } catch (error) { next(error); }
}
