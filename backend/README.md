# Cortex AI backend

## Vercel deployment

Create a separate Vercel project for this `backend` directory. Set its **Root Directory** to `cortex-ai/backend` (or deploy from that directory). The deployed backend URL must be used as the frontend `VITE_API_URL` value without an `/api` suffix.

Required backend environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `GOOGLE_CLIENT_ID`
- `GEMINI_API_KEY`

Verify the deployment at `https://your-backend.vercel.app/api/health`. It should return JSON with `status: "OK"`.