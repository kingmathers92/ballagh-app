import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { registerSW } from "virtual:pwa-register";

import "@fontsource/reem-kufi/arabic-400.css";
import "@fontsource/reem-kufi/arabic-700.css";
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "./styles/global.css";

registerSW();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
