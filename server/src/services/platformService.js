import { detectPlatform } from "../../../packages/platform-adapters/src/index.js";
import { ApplicationEngine } from "../../../packages/application-engine/src/index.js";
import { platformAdapters } from "../../../packages/platform-adapters/src/index.js";

const engine = new ApplicationEngine(platformAdapters);

export function identifyPlatform(url) {
  return detectPlatform(url);
}

export async function prepareJobApplication({ job, profile }) {
  const platform = detectPlatform(job.url);
  if (!["naukri", "instahyre"].includes(platform)) {
    return {
      status: "PENDING_APPROVAL",
      platform,
      job,
      draft: {
        candidateName: profile.fullName || "",
        email: profile.email || "",
        relevantSkills: profile.skills || [],
        checklist: ["Open the job link", "Review the role", "Complete the application manually"]
      },
      submissionMode: "USER_SUBMITS"
    };
  }
  return engine.prepare({ platform, job, profile });
}
