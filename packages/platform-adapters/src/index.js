import { NaukriAdapter } from "./naukriAdapter.js";
import { InstahyreAdapter } from "./instahyreAdapter.js";

export const platformAdapters = [new NaukriAdapter(), new InstahyreAdapter()];

export function detectPlatform(url = "") {
  try {
    const host = new URL(url).hostname.toLowerCase();
    if (host === "naukri.com" || host.endsWith(".naukri.com")) return "naukri";
    if (host === "instahyre.com" || host.endsWith(".instahyre.com")) return "instahyre";
    if (host.includes("linkedin.com")) return "linkedin";
    if (host.includes("indeed.")) return "indeed";
    if (host.includes("foundit.")) return "foundit";
    return "company_site";
  } catch {
    return "unknown";
  }
}
