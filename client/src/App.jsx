import { useEffect, useState } from "react";
import { BriefcaseBusiness, BookmarkCheck, Target, UserRound, Plus, ExternalLink, RefreshCw } from "lucide-react";
import { getProfile, saveProfile, getJobs, getApplications, createJob, updateStatus } from "./api";

const emptyJob = { title: "", company: "", location: "", url: "", description: "" };

export default function App() {
  const [tab, setTab] = useState("overview");
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [apps, setApps] = useState([]);
  const [form, setForm] = useState(emptyJob);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    setBusy(true);
    try {
      const [p, j, a] = await Promise.all([getProfile(), getJobs(), getApplications()]);
      setProfile(p); setJobs(j); setApps(a); setMessage("");
    } catch { setMessage("Cannot reach API. Start MongoDB and the server, then refresh."); }
    finally { setBusy(false); }
  }
  useEffect(() => { refresh(); }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    try { const updated = await saveProfile(profile); setProfile(updated); setMessage("Profile saved."); }
    catch { setMessage("Could not save profile."); }
  }
  async function handleAddJob(e) {
    e.preventDefault();
    try { await createJob(form); setForm(emptyJob); await refresh(); setMessage("Job saved and scored."); }
    catch (err) { setMessage(err.response?.data?.message || "Could not save job."); }
  }
  async function setStatus(id, status) {
    try { await updateStatus(id, status); await refresh(); }
    catch { setMessage("Could not update application status."); }
  }

  const appliedCount = apps.filter(a => ["applied", "interview"].includes(a.status)).length;
  const avgScore = jobs.length ? Math.round(jobs.reduce((n, j) => n + j.matchScore, 0) / jobs.length) : 0;

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-icon">J</div><div><b>JobPilot AI</b><small>Career copilot</small></div></div>
      <nav>
        {[["overview","Overview",Target],["jobs","Matched jobs",BriefcaseBusiness],["applications","Applications",BookmarkCheck],["profile","My profile",UserRound]].map(([key,label,Icon]) =>
          <button key={key} className={tab===key?"nav active":"nav"} onClick={()=>setTab(key)}><Icon size={18}/>{label}</button>)}
      </nav>
      <div className="sidebar-foot">Human-approved applications<br/><span>v1.0 · Local MVP</span></div>
    </aside>
    <main className="main">
      <header><div><p className="eyebrow">JOB SEARCH WORKSPACE</p><h1>{({overview:"Overview",jobs:"Matched jobs",applications:"Application tracker",profile:"Candidate profile"})[tab]}</h1></div><button className="icon-button" onClick={refresh} title="Refresh"><RefreshCw size={18}/></button></header>
      {message && <div className="notice">{message}</div>}
      {tab==="overview" && <section>
        <div className="hero"><div><p className="eyebrow light">YOUR NEXT OPPORTUNITY STARTS HERE</p><h2>Find work that fits<br/>your experience.</h2><p>Discover, evaluate and manage your job applications in one place.</p><button className="button white" onClick={()=>setTab("jobs")}>Explore matched jobs</button></div><div className="hero-mark">✦</div></div>
        <div className="stats">
          <Stat label="Jobs saved" value={jobs.length} icon={<BriefcaseBusiness/>}/>
          <Stat label="Average match" value={`${avgScore}%`} icon={<Target/>}/>
          <Stat label="Applications" value={appliedCount} icon={<BookmarkCheck/>}/>
        </div>
        <div className="section-head"><div><h3>Recent opportunities</h3><p>Jobs you've saved for review</p></div><button className="text-button" onClick={()=>setTab("jobs")}>View all →</button></div>
        <JobList jobs={jobs.slice(0,4)} onStatus={setStatus}/>
      </section>}
      {tab==="jobs" && <section>
        <div className="section-head"><div><h3>Job matches</h3><p>Save a job you are viewing, or add one manually.</p></div></div>
        <form className="job-form" onSubmit={handleAddJob}>
          <input required placeholder="Job title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
          <input placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})}/>
          <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
          <input required type="url" placeholder="Job URL *" value={form.url} onChange={e=>setForm({...form,url:e.target.value})}/>
          <textarea placeholder="Job description (helps matching)" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
          <button className="button primary"><Plus size={16}/> Save and score job</button>
        </form>
        <JobList jobs={jobs} onStatus={setStatus}/>
      </section>}
      {tab==="applications" && <section><div className="section-head"><div><h3>Application history</h3><p>Keep your search organized.</p></div></div>
        <div className="application-list">{apps.map(a=><div className="application-row" key={a._id}><div><b>{a.job?.title}</b><p>{a.job?.company} · {a.job?.location}</p></div><select value={a.status} onChange={e=>setStatus(a.job._id,e.target.value)}><option value="analyzed">Analyzed</option><option value="pending_approval">Pending approval</option><option value="applied">Applied</option><option value="interview">Interview</option><option value="rejected">Rejected</option><option value="withdrawn">Withdrawn</option></select></div>)}</div>
      </section>}
      {tab==="profile" && profile && <section><form className="profile-form" onSubmit={handleSaveProfile}>
        <h3>Candidate profile</h3><p>Matching is calculated from these preferences.</p>
        <label>Full name<input value={profile.fullName||""} onChange={e=>setProfile({...profile,fullName:e.target.value})}/></label>
        <label>Email<input type="email" value={profile.email||""} onChange={e=>setProfile({...profile,email:e.target.value})}/></label>
        <label>Experience (years)<input type="number" min="0" step=".5" value={profile.experienceYears} onChange={e=>setProfile({...profile,experienceYears:Number(e.target.value)})}/></label>
        <label>Current title<input value={profile.currentTitle||""} onChange={e=>setProfile({...profile,currentTitle:e.target.value})}/></label>
        <label>Skills (comma separated)<textarea value={(profile.skills||[]).join(", ")} onChange={e=>setProfile({...profile,skills:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/></label>
        <label>Preferred roles (comma separated)<textarea value={(profile.preferredRoles||[]).join(", ")} onChange={e=>setProfile({...profile,preferredRoles:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/></label>
        <label>Preferred locations (comma separated)<input value={(profile.preferredLocations||[]).join(", ")} onChange={e=>setProfile({...profile,preferredLocations:e.target.value.split(",").map(s=>s.trim()).filter(Boolean)})}/></label>
        <label>Expected CTC (LPA)<input type="number" value={profile.expectedCtcLpa||""} onChange={e=>setProfile({...profile,expectedCtcLpa:Number(e.target.value)})}/></label>
        <button className="button primary">Save profile</button>
      </form></section>}
      {busy && <div className="loading">Refreshing…</div>}
      <footer>JobPilot AI · Your data stays in your local MongoDB instance.</footer>
    </main>
  </div>;
}

function Stat({label,value,icon}) { return <div className="stat"><div className="stat-icon">{icon}</div><div><strong>{value}</strong><span>{label}</span></div></div>; }
function JobList({jobs,onStatus}) {
  if (!jobs.length) return <div className="empty"><BriefcaseBusiness size={28}/><b>No jobs yet</b><span>Save a job to see its match score here.</span></div>;
  return <div className="job-list">{jobs.map(job=><article className="job-card" key={job._id}>
    <div className="job-top"><div className="company-mark">{(job.company||"J").slice(0,1).toUpperCase()}</div><div className="job-title"><b>{job.title}</b><span>{job.company} · {job.location||"Location not specified"}</span></div><div className="score"><strong>{job.matchScore}%</strong><small>match</small></div></div>
    <div className="reasons">{(job.matchReasons||[]).map(r=><span key={r}>{r}</span>)}</div>
    <div className="job-actions"><a href={job.url} target="_blank" rel="noreferrer">Open job <ExternalLink size={13}/></a><button onClick={()=>onStatus(job._id,"pending_approval")}>Mark for review</button><button onClick={()=>onStatus(job._id,"applied")}>Mark applied</button></div>
  </article>)}</div>;
}
