# JobPilot AI

A human-approved job application assistant built with MongoDB, Express, React and a Chrome Manifest V3 extension.

## MVP capabilities
- Create and manage a candidate profile.
- Capture a job the user is currently viewing and explicitly chooses to save.
- Score jobs against the candidate's skills and preferred roles using transparent keyword matching.
- Review job details and track application status.
- Copy tailored application answers and assist with form filling.
- No unattended scraping, mass messaging, CAPTCHA bypass, credential collection or automatic submission.

**Naukri compatibility:** Use this extension only where permitted by Naukri's current terms and policies. The user navigates Naukri themselves and initiates each capture/fill action. Confirm the site's current rules before using any page integration. The extension does not log in, crawl search results, or click the final Apply/Submit button.

## Requirements
- Node.js 20+
- MongoDB local instance or MongoDB Atlas
- Chrome/Chromium
- npm

## Run locally
1. Copy `.env.example` to `server/.env` and set `MONGODB_URI` and a strong `JWT_SECRET`.
2. Install root dependencies: `npm install`
3. Install server dependencies: `npm install -w server`
4. Install client dependencies: `npm install -w client`
5. Start MongoDB.
6. Run `npm run dev`.
7. Open `http://localhost:5173`.

The API runs on `http://localhost:5000`.

## Load Chrome extension
1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Select **Load unpacked**.
4. Choose the `extension/` folder.
5. Open a job detail page, then use the extension popup's **Capture current page** action.
6. Review the extracted details before saving. If page extraction is unavailable or disallowed, paste the job title, company and URL manually in the dashboard.

The extension connects to `http://localhost:5000` by default. It stores no Naukri password or session cookie.

## API overview
- `GET /api/health`
- `POST /api/profile`
- `GET /api/profile`
- `POST /api/jobs`
- `GET /api/jobs`
- `GET /api/jobs/:id`
- `PATCH /api/jobs/:id/status`

This starter intentionally keeps auth out of the first local MVP. Before deployment, add authentication, per-user authorization, rate limiting, validation, audit logs and secure secrets management.

## Suggested next milestones
1. Add JWT authentication and user-scoped data.
2. Add resume upload and parsing with explicit user consent.
3. Add an LLM-based job fit explanation (server-side API key only).
4. Add per-site adapters only after confirming site permission.
5. Add tests, deployment, monitoring and privacy controls.
