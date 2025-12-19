import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { ClerkAuthProvider } from "./context/ClerkAuthContext";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <ClerkAuthProvider>
        <AppRouter />
      </ClerkAuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);
