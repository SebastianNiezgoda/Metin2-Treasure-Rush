import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // Globalne style
import { BrowserRouter } from "react-router-dom";

// Jeśli masz service-worker.js w public/, można zarejestrować:
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log("✅ Service Worker zarejestrowany:", reg.scope);
      })
      .catch(err => {
        console.warn("❌ Rejestracja Service Workera nie powiodła się:", err);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
