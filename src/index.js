import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

// This is a website, not an installable app: stop Chrome/Brave/Samsung
// Internet from showing the "Install app" banner. (manifest.json also uses
// "display": "browser", which makes the site non-installable.)
window.addEventListener("beforeinstallprompt", (event) => event.preventDefault());

// Vercel Web Analytics, only on the live domain (the script exists only
// there once Analytics is switched on in the Vercel dashboard).
if (window.location.hostname.endsWith("spearsresiliencesystems.com")) {
  window.va = window.va || function va() {
    (window.vaq = window.vaq || []).push(arguments);
  };
  const script = document.createElement("script");
  script.defer = true;
  script.src = "/_vercel/insights/script.js";
  document.head.appendChild(script);
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
