# Dockyard Docs (Training / Intentionally Insecure)

**TRAINING / INTENTIONALLY INSECURE — DO NOT DEPLOY**

Dockyard Docs is a deliberately vulnerable Next.js app for a security workshop. It is designed to demonstrate STRIDE-lite threat modeling and Secure SDLC conversations. The flaws are enabled by default and should only be used in a controlled training environment.

## Safety gate
The app refuses to start unless `TRAINING_MODE=true` is set in the environment.

## Stack
- Next.js 14 (App Router) + TypeScript
- Firebase Auth (email/password)
- Firebase Storage
- MongoDB (official driver)
- Tailwind CSS

## Local setup

### 1) Start MongoDB
```bash
docker compose up -d
```

### 2) Create a Firebase project
1. Create a Firebase project.
2. Enable **Email/Password** auth in Firebase Authentication.
3. Create a service account and download the JSON.
4. Create a Storage bucket.

### 3) Configure Firebase Storage rules (intentionally insecure)
Apply the rules from `storage.rules` in the Firebase console.

### 4) Configure environment variables
Copy `.env.example` to `.env.local` and fill in values:
```bash
cp .env.example .env.local
```

### 5) Install deps and run
```bash
npm install
npm run dev
```

## Demo accounts
1. Sign up in the UI with email/password.
2. Seed an admin record:
```bash
curl -X POST http://localhost:3000/api/seed/admin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com"}'
```
This updates the Mongo `users` collection to mark that email as `role: "admin"`.

## Intentional flaws (overview)
All flaws are enabled by default and grouped in `lib/labFlaws.ts`.

### STRIDE-lite mapping table
| Category | Example flaws in this app |
| --- | --- |
| Spoofing | Best-effort auth decoding; `?uid=` impersonation; token from query (`lib/auth.ts`). |
| Tampering | Status update trusts client-supplied `role`/`ownerUid`; arbitrary storage path on upload (`app/api/files/[id]/status`, `app/api/upload`). |
| Repudiation | Minimal/no audit logs; errors logged with sensitive context (`app/api/*`). |
| Information Disclosure | Overfetching admin data; share endpoint leaks metadata; `/api/debug` returns env + data; AI prompt leaks internal data (`app/api/admin/*`, `app/api/share/[token]`, `app/api/debug`, `app/api/ai/chat`). |
| Denial of Service | No upload size limits, regex search ReDoS risk (`app/api/upload`, `app/api/files/search`). |
| Elevation of Privilege | Admin endpoints lack server-side role checks; user lookup IDOR; AI trusts user instructions (`app/api/admin/*`, `app/api/users/[uid]`, `app/api/ai/chat`). |

## Additional insecure behaviors (non-exhaustive)
- Uploads accept any file type and size; server emits verbose errors.
- Share tokens are low entropy and expiry is ignored.
- Download endpoint does not enforce ownership.
- Insecure storage rules and long-lived signed URLs.
- Permissive CORS on all API routes.
- Password reset reveals if an email exists.
- HTML notes rendered unsafely in file views.
- Account delete endpoint lacks CSRF protection.
- AI chat prompt includes internal data and trusts user instructions.

## Supply Chain and CI Security (GitHub)

### OWASP ZAP baseline scan (already added in this repo)
A scheduled and on-demand ZAP baseline workflow is included at:
- `.github/workflows/zap-baseline.yml`

What it does:
- Runs every Monday at 09:00 UTC and on manual trigger (`workflow_dispatch`).
- Scans `https://app01.inceptionu-webinar.com` with OWASP ZAP baseline defaults.
- Manual runs support:
  - `severity_threshold`: `critical`, `high`, `medium`, `low`, `informational`
  - `enforcement`: `fail` or `warn`

### OWASP ZAP full scan (manual, optional authenticated mode)
A deeper manual workflow is included at:
- `.github/workflows/zap-full-auth.yml`

How to use:
1. In GitHub, go to `Actions` -> `OWASP ZAP Full Scan (Authenticated)` -> `Run workflow`.
2. Provide the `target` URL.
3. Choose a `severity_threshold` (`critical`, `high`, `medium`, `low`, or `informational`).
4. Choose `enforcement` mode:
   - `fail`: fail the workflow when findings meet/exceed the selected threshold.
   - `warn`: add a GitHub warning annotation but keep the workflow successful.

Authentication options (via repository secrets):
- Preferred: set `ZAP_AUTH_BEARER_TOKEN` (sent as `Authorization: Bearer <token>`).
- Alternative: set both `ZAP_AUTH_USERNAME` and `ZAP_AUTH_PASSWORD` (sent as HTTP Basic auth header).
- If none of the above are set, the scan runs unauthenticated.

### Enable CodeQL via GitHub UI
1. Open the repository on GitHub.
2. Go to `Security` -> `Code scanning`.
3. Click `Set up code scanning`, then choose `CodeQL analysis`.
4. Select the `Default` setup for JavaScript/TypeScript.
5. Commit the generated workflow to your default branch.

### Enable Dependabot via GitHub UI
1. Open the repository on GitHub.
2. Go to `Security` -> `Dependabot`.
3. Enable `Dependabot alerts` and `Dependabot security updates` when prompted.
4. For version update PRs, use the Dependabot UI prompt to create a `dependabot.yml` in `.github/dependabot.yml`, then commit it.

### Enable Secret Scanning via GitHub UI
1. Open the repository on GitHub.
2. Go to `Settings` -> `Security` -> `Advanced Security`.
3. Enable `Secret scanning`.
4. Enable `Push protection` so commits containing detected secrets are blocked before merge.
5. Optionally enable `Validity checks` (if available on your plan) to help prioritize real credential leaks.

## Notes
This app is **for training only**. Do not deploy publicly.
