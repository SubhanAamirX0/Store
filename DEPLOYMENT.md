# Deploying Mithri

This project can be deployed in either of two ways:

1. One Render service that serves both the API and the built React app.
2. Separate frontend/backend deployments, with the React app on Vercel and the API on Render.

## What You Need

- A GitHub repository containing this folder.
- A MongoDB Atlas database connection string.
- A Render account connected to that GitHub repository.

## Option 1: Single Render Service

1. Push this project to GitHub.
2. In Render, create a new Blueprint from the repository.
3. Render will read `render.yaml`.
4. Add `MONGODB_URI` when Render asks for environment variables.
5. If the React app is hosted elsewhere, set `CLIENT_URL` to that public URL.
6. Deploy.

## Option 2: Vercel Frontend + Render Backend

1. Deploy `Client` to Vercel.
2. Set the Vercel environment variable `VITE_API_URL` to your Render API URL, for example `https://your-api.onrender.com/api`.
3. Deploy `Server` to Render.
4. Set Render environment variables:
   - `MONGODB_URI`
   - `CLIENT_URL` to your Vercel site URL, for example `https://your-store.vercel.app`
5. The backend will redirect browser visits to the frontend, and API calls will stay on `/api`.

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

## Seeding Atlas Safely

1. Copy `Server/.env.atlas.example` to your local `Server/.env` if you want a template for Atlas.
2. Put your Atlas URI in `MONGODB_URI`.
3. From the `Server` folder, run:

```powershell
npm run seed:empty
```

4. If the database is empty, this will create:
   - `categories`
   - `products`

5. If the database already has data, the command exits without changing anything.
