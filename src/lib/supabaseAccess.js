import { supabase } from "./supabaseClient";

/**
 * Submit a 4-digit access code to gain premium access
 * Calls the verify_code RPC function which:
 * - Checks if code is valid
 * - Sets user.app_metadata.premium = true if valid
 * - Returns the access role
 */
export async function submitAccessCode(code) {
  try {
    const { data, error } = await supabase.rpc("verify_code", {
      access_code: code,
    });

    if (error) {
      console.error("Access code verification error:", error);
      return { success: false, error: error.message };
    }

    // If successful, refresh the session to get updated user metadata
    if (data?.role) {
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error("Session refresh error:", refreshError);
      }
      return { success: true, role: data.role };
    }

    return { success: false, error: "Invalid code" };
  } catch (err) {
    console.error("submitAccessCode error:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Get admin key from environment
 * Used for comparing user-entered PIN with server value
 */
export function getAdminAccessCode() {
  return import.meta.env.VITE_ADMIN_ACCESS_CODE || "";
}

/**
 * Check if a code is the admin PIN
 */
export function isAdminCode(code) {
  return code === getAdminAccessCode();
}
