# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Cortex AI

## Google login configuration

The frontend and backend must use the same Google OAuth **Web application** client ID.

Current deployments:

- Frontend: `https://cortex-ai-rosy.vercel.app`
- Backend: `https://backend-six-inky-b8h2hf3zrd.vercel.app`

1. In Google Cloud Console, open the OAuth client under **APIs & Services > Credentials**.
2. Add `https://cortex-ai-rosy.vercel.app` to **Authorized JavaScript origins**. Also add any custom frontend domain used in production.
3. Add `VITE_GOOGLE_CLIENT_ID` to the frontend Vercel project.
4. Add `GOOGLE_CLIENT_ID` with the same value to the backend Vercel project.
5. Add `VITE_API_URL` to the frontend project, pointing to the deployed backend URL.
6. Redeploy the frontend after changing `VITE_*` variables because Vite embeds them during the build.

For local development, copy `.env.example` to `.env` inside `cortex-ai` and replace the placeholders. Never commit `.env`, downloaded Google client-secret JSON files, or backend secrets.
