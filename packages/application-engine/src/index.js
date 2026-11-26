export class ApplicationEngine {
  constructor(adapters) {
    this.adapters = adapters;
  }

  getAdapter(platform) {
    const adapter = this.adapters.find(item => item.platform === platform);
    if (!adapter) throw new Error(`No adapter registered for ${platform}`);
    return adapter;
  }

  async prepare({ platform, job, profile }) {
    const adapter = this.getAdapter(platform);
    const validation = await adapter.validateApplication(job, profile);

    if (!validation.eligible) {
      return { status: "SKIPPED", reason: validation.reason };
    }

    const draft = await adapter.prepareApplication(job, profile);
    return {
      status: "PENDING_APPROVAL",
      platform,
      job,
      draft,
      submissionMode: "USER_SUBMITS",
      message: "Review the draft and complete submission yourself on the job portal."
    };
  }
}
