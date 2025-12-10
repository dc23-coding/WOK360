import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";

const SupabaseAuthContext = createContext(null);

export function SupabaseAuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load current session & listen for changes
  useEffect(() => {
    let ignore = false;

    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!ignore) {
        if (error) {
          console.error("Supabase getSession error", error);
        }
        setSession(data?.session ?? null);
        setUser(data?.session?.user ?? null);
        setLoading(false);
      }
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

  // ---- helper methods used by your forms ----
  const signInWithEmail = async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  };

  const signUpWithEmail = async (email, password) => {
    return supabase.auth.signUp({ email, password });
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({ provider: "google" });
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Supabase signOut error", error);
  };

  // Memoized computed property: isPremium flag from user metadata
  const isPremium = useMemo(
    () => user?.app_metadata?.premium === true,
    [user?.app_metadata?.premium]
  );

  const value = {
    supabase,
    session,
    user,
    loading,
    isPremium,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  };

  return (
    <SupabaseAuthContext.Provider value={value}>
      {children}
    </SupabaseAuthContext.Provider>
  );
}

export function useSupabaseAuth() {
  const ctx = useContext(SupabaseAuthContext);
  if (!ctx) {
    throw new Error("useSupabaseAuth must be used inside SupabaseAuthProvider");
  }
  return ctx;
}

/**
 * Hook to check if current user has premium access
 * More convenient than accessing isPremium from useSupabaseAuth()
 */
export function usePremium() {
  const { isPremium } = useSupabaseAuth();
  return isPremium;
}
