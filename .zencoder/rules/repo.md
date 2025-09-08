# Repo Rules

- Project root: c:\Users\FAISAL\Downloads\Compressed\limitlessinfotech\limitlessinfotech
- Framework: Next.js (App Router) with custom Node server (server.js)
- Start scripts: `npm run dev` and `npm start` both use `node server.js`
- TypeScript/ESLint errors are ignored during build per next.config.mjs
- Environment: `.env.local` required; see `.env.example`
- Supabase: In dev, falls back to in-memory mock if env vars missing
- Tests: Jest configured; jsdom environment
- Styling: Tailwind CSS
- UI: shadcn/ui + Radix UI

## Conventions
- Prefer absolute imports where applicable; maintain consistent module paths
- Keep server.js as the single entry point for dev and prod
- Avoid introducing Next serverless handlers that bypass the custom server without need

## Tasks Backlog (to iterate)
- Align README run commands with custom server scripts
- Re-enable TypeScript and ESLint checks after stabilizing
- Add e2e tests for chat and critical flows
- Review dependencies pinned as `latest` and lock to known-good versions