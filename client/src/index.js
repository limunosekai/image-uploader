import React from "react";
import { createRoot } from "react-dom/client";
import { ImageProvider } from "./context/ImageContext";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ImageProvider>
      <App />
    </ImageProvider>
  </React.StrictMode>
);
