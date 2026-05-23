# Deployment Guide

This guide covers a typical Vercel frontend, Node.js backend, Supabase
PostgreSQL, and OpenAI-compatible LLM provider deployment.

## Pre-Deployment Checklist

- Rotate any API key that has ever appeared in Git history.
- Confirm `.env`, `.env.local`, private keys, and database dumps are ignored and
  untracked.
- Add environment variables in the hosting provider dashboard, not in Git.
- Enable GitHub secret scanning and push protection before making the repository
  public.
- Review `LICENSE`, `SECURITY.md`, `THIRD_PARTY_NOTICES.md`, privacy policy, and
  service terms.

## Backend

Recommended hosts: Railway, Render, Fly.io, or any Node.js host.

Build command:

```bash
npm install
npm run build
```

Start command:

```bash
npm start
```

Required environment variables:

```env
DATABASE_URL="postgresql://postgres.xxxxx:<YOUR_DATABASE_PASSWORD>@aws-x-region.pooler.supabase.com:6543/postgres?pgbouncer=true"
OPENAI_API_KEY="your-llm-api-key"
OPENAI_BASE_URL="https://api.deepseek.com"
OPENAI_MODEL="deepseek-chat"
OPENAI_MAX_TOKENS=4000
PORT=3001
NODE_ENV="production"
CORS_ORIGIN="https://your-frontend-domain.example"
RATE_LIMIT_WINDOW_MS=3600000
RATE_LIMIT_MAX_REQUESTS=20
```

Database setup:

```bash
npx prisma db push
```

For Supabase Pooler connections, use port `6543` and add `pgbouncer=true` to the
connection string.

## Frontend

Recommended host: Vercel.

Set the project root to `frontend`.

Build command:

```bash
npm install
npm run build
```

Required environment variable:

```env
NEXT_PUBLIC_API_URL="https://your-backend-domain.example"
```

## CORS

Set backend `CORS_ORIGIN` to the exact frontend origin. Avoid `*` for production
because the client sends credentialed requests.

## Post-Deployment Verification

1. Open `GET /health` on the backend.
2. Open the frontend and confirm the agent list loads.
3. Submit a low-risk test task.
4. Confirm task history loads for the same client.
5. Confirm `/privacy` and `/terms` are reachable.

## Operations

- Monitor LLM spend and rate-limit errors.
- Back up the database before schema changes.
- Keep API keys in the hosting provider secret manager.
- Re-run dependency and secret scans before each public release.
