import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "../styles/globals.css";
import App from "./shared/app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
