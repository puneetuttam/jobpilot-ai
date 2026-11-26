import { BasePlatformAdapter } from "./baseAdapter.js";

export class NaukriAdapter extends BasePlatformAdapter {
  constructor() { super("naukri"); }
  // Deliberately no crawling, login automation or submit-button automation.
  // Job details are supplied by the user through the extension/dashboard.
}
