// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("Supabase Config:", {
  url: supabaseUrl,
  keyLength: supabaseAnonKey?.length,
  keyPrefix: supabaseAnonKey?.substring(0, 20) + "..."
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase env vars");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection on load
supabase.from('profiles').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("Supabase connection test failed:", error);
    } else {
      console.log("✅ Supabase connected successfully");
    }
  });
