# Pixel Perfect Snapshot

Implement exactly the screenshot and nothing else

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pixel-perfect-snap-5512.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/78f36854-c9e1-43e8-a9be-968c5d4da775).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Backend API

The frontend can run in local-only mode or connect to the Spring Boot API. For local development, create an untracked `.env.local` containing:

```env
VITE_API_BASE_URL=http://localhost:8082
```

The backend and PostgreSQL setup instructions are in the sibling `backend` repository. Restart the Vite dev server after changing environment variables.

For a Lovable-hosted deployment, configure `VITE_API_BASE_URL` in the Lovable project's environment-variable settings with the public HTTPS URL of the deployed API. Do not use a `localhost` URL in the hosted frontend: it would point to the visitor's own computer. The API must also allow the exact Lovable app origin in `FRONTEND_ORIGINS`.

The local `.env.local` file is ignored by Git. Never commit credentials or private database URLs into the frontend repository.
