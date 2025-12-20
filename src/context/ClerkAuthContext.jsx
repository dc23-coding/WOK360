import { createContext, useContext, useMemo } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { supabase } from "../lib/supabaseClient";

const ClerkAuthContext = createContext(null);

export function ClerkAuthProvider({ children }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signOut: clerkSignOut } = useClerk();

  // Transform Clerk user to match old Supabase structure
  const user = useMemo(() => {
    if (!clerkUser) return null;
    
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress,
      // Map Clerk metadata to Supabase-like structure for compatibility
      app_metadata: {
        premium: clerkUser.publicMetadata?.premium || clerkUser.publicMetadata?.isPremium || false,
      },
      user_metadata: clerkUser.publicMetadata || {},
      created_at: clerkUser.createdAt,
    };
  }, [clerkUser]);

  // Determine premium status from Clerk user metadata
  const isPremium = useMemo(
    () => clerkUser?.publicMetadata?.premium === true || clerkUser?.publicMetadata?.isPremium === true,
    [clerkUser?.publicMetadata]
  );

  const signOut = async () => {
    try {
      await clerkSignOut();
      // Optionally redirect to home or refresh
      window.location.href = '/';
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    supabase, // Still available for data operations
    session: isSignedIn ? { user } : null,
    user,
    loading: !isLoaded,
    isPremium,
    isSignedIn,
    signOut,
  };

  return (
    <ClerkAuthContext.Provider value={value}>
      {children}
    </ClerkAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(ClerkAuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used inside ClerkAuthProvider");
  }
  return ctx;
}

export function usePremium() {
  const { isPremium } = useSupabaseAuth();
  return isPremium;
}
