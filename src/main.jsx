import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./AppRouter";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { ClerkAuthProvider } from "./context/ClerkAuthContext";

// Ensure URL methods are available globally for Clerk
if (typeof window !== 'undefined') {
  // Polyfill for URL.startsWith if needed
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    // Ensure url is a string
    const urlString = typeof url === 'string' ? url : url?.toString() || '';
    return originalFetch.call(this, urlString, options);
  };
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY in .env.local");
}

// Ensure window.location.origin is properly set
const origin = typeof window !== 'undefined' ? window.location.origin : '';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={clerkPubKey}
      afterSignInUrl={origin + "/"}
      afterSignUpUrl={origin + "/"}
      signInUrl={origin + "/"}
      signUpUrl={origin + "/"}
    >
      <ClerkAuthProvider>
        <AppRouter />
      </ClerkAuthProvider>
    </ClerkProvider>
  </React.StrictMode>
);
