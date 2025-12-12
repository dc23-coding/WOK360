import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";
import { SupabaseAuthProvider } from "./context/SupabaseAuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SupabaseAuthProvider>
      <AppRouter />
    </SupabaseAuthProvider>
  </React.StrictMode>
);
