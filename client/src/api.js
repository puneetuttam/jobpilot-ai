import axios from "axios";
const api = axios.create({ baseURL: "http://localhost:5000/api", timeout: 10000 });
export const getProfile = async () => (await api.get("/profile")).data;
export const saveProfile = async data => (await api.post("/profile", data)).data;
export const getJobs = async () => (await api.get("/jobs")).data;
export const getApplications = async () => (await api.get("/jobs/applications")).data;
export const createJob = async data => (await api.post("/jobs", data)).data;
export const updateStatus = async (id, status) => (await api.patch(`/jobs/${id}/status`, { status })).data;
