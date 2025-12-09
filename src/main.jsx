// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { NavigationProvider } from "./navigation";

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </React.StrictMode>
  );
}
