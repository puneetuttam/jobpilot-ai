const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9+#. ]/g, " ");

export function scoreJob(job, profile) {
  const haystack = normalize(`${job.title} ${job.description} ${(job.skills || []).join(" ")}`);
  const skills = (profile.skills || []).map(s => s.trim()).filter(Boolean);
  const matchedSkills = skills.filter(skill => haystack.includes(normalize(skill)));
  const skillScore = skills.length ? matchedSkills.length / skills.length : 0;

  const roleText = normalize((profile.preferredRoles || []).join(" "));
  const titleText = normalize(job.title);
  const roleMatch = (profile.preferredRoles || []).some(role => {
    const tokens = normalize(role).split(" ").filter(t => t.length > 2);
    return tokens.length && tokens.some(token => titleText.includes(token));
  });

  const locations = (profile.preferredLocations || []).map(normalize);
  const locationMatch = !job.location || locations.some(loc => normalize(job.location).includes(loc));
  const score = Math.round(Math.min(100, skillScore * 75 + (roleMatch ? 15 : 0) + (locationMatch ? 10 : 0)));

  const reasons = [];
  if (matchedSkills.length) reasons.push(`Matching skills: ${matchedSkills.slice(0, 8).join(", ")}`);
  if (roleMatch) reasons.push("Title overlaps with your preferred roles");
  if (locationMatch) reasons.push("Location matches your preferences or is unspecified");
  if (!reasons.length) reasons.push("Limited overlap found; review manually");

  return { score, reasons, matchedSkills };
}
