# Deploying Mithri

This project is prepared for a single Render web service.

## What You Need

- A GitHub repository containing this folder.
- A MongoDB Atlas database connection string.
- A Render account connected to that GitHub repository.

## Render Setup

1. Push this project to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml`.
4. Add `MONGODB_URI` when Render asks for environment variables.
5. Deploy.

The React store is built with `VITE_API_URL=/api`, and the Express server serves the built storefront plus the API from the same public URL.

## Local Development

Client:

```powershell
cd Client
npm run dev
```

Server:

```powershell
cd Server
npm run dev
```
