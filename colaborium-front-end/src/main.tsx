import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Login from "./pages/Login.tsx";
import App from "./shared/app/App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Login />
  </StrictMode>,
);
