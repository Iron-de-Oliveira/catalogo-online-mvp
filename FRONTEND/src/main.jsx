import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Routes from "./routes/routes";

import "./styles/style.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Routes />
  </StrictMode>
);