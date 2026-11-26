const $ = id => document.getElementById(id);

function detectPlatform(rawUrl = "") {
  try {
    const host = new URL(rawUrl).hostname.toLowerCase();
    if (host === "naukri.com" || host.endsWith(".naukri.com")) return "Naukri";
    if (host === "instahyre.com" || host.endsWith(".instahyre.com")) return "Instahyre";
    if (host.includes("linkedin.com")) return "LinkedIn";
    if (host.includes("indeed.")) return "Indeed";
    if (host.includes("foundit.")) return "Foundit";
    return "Company career site / Other";
  } catch { return "Unknown platform"; }
}

(async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;
  $("title").value = (tab.title || "").slice(0, 180);
  $("url").value = tab.url || "";
  $("platform").textContent = `Detected: ${detectPlatform(tab.url)}`;
})();

$("save").addEventListener("click", async () => {
  const payload = {
    title: $("title").value.trim(),
    company: $("company").value.trim(),
    location: $("location").value.trim(),
    url: $("url").value.trim(),
    description: $("description").value.trim(),
    source: detectPlatform($("url").value)
  };
  if (!payload.title || !payload.url) {
    $("status").textContent = "Add a job title. The page URL is required.";
    return;
  }
  try {
    const response = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Could not save job");
    $("status").textContent = `Saved for review · ${data.matchScore}% match`;
  } catch (error) {
    $("status").textContent = error.message || "Cannot connect to JobPilot API.";
  }
});
