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
| Spoofing | Best-effort auth decoding; missing verification in some routes (`lib/auth.ts`, multiple API routes). |
| Tampering | Status update trusts client-supplied `role`/`ownerUid` (`app/api/files/[id]/status`). |
| Repudiation | Minimal/no audit logs; errors logged with sensitive context (`app/api/*`). |
| Information Disclosure | Overfetching admin data; share endpoint leaks metadata; public Firebase URLs (`app/api/admin/*`, `app/api/share/[token]`). |
| Denial of Service | No upload size limits, no rate limiting (`app/api/upload`). |
| Elevation of Privilege | Admin endpoints lack server-side role checks (`app/api/admin/*`). |

## Additional insecure behaviors (non-exhaustive)
- Uploads accept any file type and size; server emits verbose errors.
- Share tokens are low entropy and expiry is ignored.
- Download endpoint does not enforce ownership.
- Insecure storage rules and long-lived signed URLs.
- Permissive CORS on all API routes.

## Notes
This app is **for training only**. Do not deploy publicly.
