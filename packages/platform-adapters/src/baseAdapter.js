export class BasePlatformAdapter {
  constructor(platform) {
    this.platform = platform;
  }

  async validateApplication(job, profile) {
    if (!job?.title || !job?.url) {
      return { eligible: false, reason: "Job title and URL are required." };
    }
    if (!profile) {
      return { eligible: false, reason: "Candidate profile is missing." };
    }
    return { eligible: true, reason: "Ready for user review." };
  }

  async prepareApplication(job, profile) {
    return {
      candidateName: profile.fullName || "",
      email: profile.email || "",
      experienceYears: profile.experienceYears ?? "",
      currentTitle: profile.currentTitle || "",
      relevantSkills: profile.skills || [],
      jobTitle: job.title,
      company: job.company || "",
      questions: [],
      checklist: [
        "Confirm the job is still open",
        "Review the selected resume",
        "Verify every pre-filled answer",
        "Check salary, notice period and location",
        "Submit manually on the platform"
      ]
    };
  }

  async assistWithForm() {
    return {
      supported: false,
      reason: "No site-specific form automation is enabled. Use the platform's permitted workflow and submit manually."
    };
  }
}
