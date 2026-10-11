import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./shared/app/App.tsx";
import "../styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
