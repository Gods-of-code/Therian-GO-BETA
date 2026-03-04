import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./variables.css";
import "./app.css";

const SKIP_AUTH = import.meta.env.VITE_SKIP_AUTH === "true";
if (SKIP_AUTH) {
  try {
    localStorage.setItem("token", "dev-token");
    localStorage.setItem("token_type", "bearer");
    if (window.location.pathname === "/" || window.location.pathname === "/login") {
      window.location.replace("/app/discover");
    }
  } catch (e) {
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>
);
