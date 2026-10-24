# Cortex AI backend

## Vercel deployment

Create a separate Vercel project for this `backend` directory. Set its **Root Directory** to `cortex-ai/backend` (or deploy from that directory). The deployed backend URL must be used as the frontend `VITE_API_URL` value without an `/api` suffix.

Required backend environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GEMINI_API_KEY`

Verify the deployment at `https://your-backend.vercel.app/api/health`. It should return JSON with `status: "OK"` and `"database": "connected"`. A `503` means the backend is up but cannot connect to MongoDB. Confirm `MONGO_URI` is set for the backend Vercel project and that the MongoDB provider allows connections from the deployed backend. For MongoDB Atlas, check the deployment's allowed network access and database-user credentials; prefer fixed egress or a private network over broadly opening database access.