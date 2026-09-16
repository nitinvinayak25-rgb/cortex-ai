import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css"

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!googleClientId) {
  throw new Error(
    "Missing VITE_GOOGLE_CLIENT_ID. Add the Google OAuth web client ID to Vercel and the local .env file."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider
      clientId={googleClientId}
    >
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);