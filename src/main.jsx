// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

// 🔹 ADD THIS LINE (or the correct path to your global CSS)
import "./index.css"; // or "./styles.css" if that's what you use

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log("import.meta.env:", import.meta.env);
console.log("VITE_CLERK_PUBLISHABLE_KEY:", PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
  console.error(
    "❌ Missing Clerk publishable key. Check .env.local is in WOK360 and dev server was restarted."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
