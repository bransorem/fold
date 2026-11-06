# Fold

Scaffold for building new apps on an opinionated stack.

## Tech and data

This repository is a Bun workspace. The web app is at the repository root and uses TanStack Start, React, and Vite. The separate API in `server/` uses Hono, Better Auth, and Cloudflare Workers.

## Local development

Install dependencies:

```bash
bun install
```

Create the API's local secrets file and set a Better Auth secret of at least 32 characters:

```bash
cp server/.dev.vars.example server/.dev.vars
```

Start the frontend and API together:

```bash
bun run dev
```

The frontend runs at `http://localhost:3000`; the API runs at `http://localhost:8000` and exposes `GET /api/health`. The frontend's default API origin is `http://localhost:8788`, so for local development set `VITE_API_ORIGIN=http://localhost:8000` in the frontend environment (for example, a root `.env.local`). You can run either service alone with `bun run dev:web` or `bun run dev:server`.

The API uses local D1 emulation. Apply its migrations with:

```bash
cd server && bun run db:migrate:local
```

## Configuration

For local Google or Apple sign-in, add provider credentials to `server/.dev.vars`. Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`, or `APPLE_CLIENT_ID` and `APPLE_CLIENT_SECRET`, as appropriate. Register each provider callback as `{API_ORIGIN}/api/auth/callback/{provider}`. Keep Apple's client secret current. `VITE_API_ORIGIN` tells the browser which API URL to call.

New Better Auth accounts have `user.authorized = 0` and cannot use member features until approved. Apply migrations with `cd server && bun run db:migrate:remote`.

Set `BETTER_AUTH_SECRET` for the API Worker and keep it private. Use a Worker secret rather than committing it:

```bash
wrangler secret put BETTER_AUTH_SECRET --config server/wrangler.jsonc
```

## Build and checks

```bash
bun run build
bun run check:all
bun run lint
```

`bun run build` builds the web app and API. The project also provides `bun run format` to format files with Biome.

## Cloudflare deployment

Before deploying, configure Cloudflare resources and environment values:

1. Create a D1 database and R2 bucket for the API. Update `server/wrangler.jsonc` with the real D1 database ID and bucket name.
2. Set `BETTER_AUTH_SECRET` for the API as a Worker secret. Set OAuth provider secrets if social sign-in is enabled.
3. Configure the deployed `WEB_ORIGIN`, `API_ORIGIN`, and frontend `VITE_API_ORIGIN` to the deployed frontend and API URLs.
5. Apply the API database migrations and deploy both Workers:

```bash
cd server && bun run db:migrate:remote
cd .. && bun run deploy:server
bun run deploy
```

`bun run deploy` builds and deploys the frontend. `bun run deploy:server` deploys the API.

### GitHub Actions deployment

The `Deploy Cloudflare Workers` workflow runs on pushes to `main` and can also be started from the Actions tab. In the GitHub repository settings, add these Actions secrets:

- `CLOUDFLARE_API_TOKEN`, with permission to deploy Workers and apply D1 migrations.
- `CLOUDFLARE_ACCOUNT_ID`.

Add the repository Actions variable `VITE_API_ORIGIN` with the public API origin, such as `https://api.example.com`. The workflow builds the app, applies pending API D1 migrations, deploys the API Worker, and then deploys the frontend Worker. Set `BETTER_AUTH_SECRET` and any OAuth secrets directly on the API Worker in Cloudflare; GitHub Actions does not need their values.
