import { BasePlatformAdapter } from "./baseAdapter.js";

export class InstahyreAdapter extends BasePlatformAdapter {
  constructor() { super("instahyre"); }
  // Deliberately no crawling, login automation or submit-button automation.
  // Job details are supplied by the user through the extension/dashboard.
}
