/**
 * Unified access control utility
 * Centralizes all permission checks (entry, premium, admin)
 * Used by App, HeroDoor, and hallway sections
 */

/**
 * Check if user can access a specific area or feature
 * @param {Object} user - Current user object from Supabase
 * @param {boolean} adminUnlocked - Is admin mode currently unlocked
 * @param {string} accessLevel - 'entry' (authenticated), 'premium' (premium users), 'admin' (admin only)
 * @returns {boolean} Whether user has access
 */
export function canAccess(user, adminUnlocked = false, accessLevel = "entry") {
  // Admin always has access
  if (adminUnlocked) return true;

  const isAuthenticated = !!user;
  const isPremium = user?.app_metadata?.premium === true;

  switch (accessLevel) {
    case "entry":
      // Need to be authenticated to enter house
      return isAuthenticated;
    case "premium":
      // Need premium flag to access premium content
      return isAuthenticated && isPremium;
    case "admin":
      // Admin access only (would need separate server-side check for true admin)
      return false;
    default:
      return false;
  }
}

/**
 * Get the access level/tier of current user
 * @param {Object} user - Current user object
 * @param {boolean} adminUnlocked - Is admin mode unlocked
 * @returns {string} Access tier: 'admin', 'premium', 'user', or 'guest'
 */
export function getUserAccessLevel(user, adminUnlocked = false) {
  if (adminUnlocked) return "admin";
  if (!user) return "guest";
  if (user?.app_metadata?.premium === true) return "premium";
  return "user";
}

/**
 * Check if user can access dark mode (night wing)
 * Only premium users or admin can access
 */
export function canAccessDarkMode(user, adminUnlocked = false) {
  return canAccess(user, adminUnlocked, "premium");
}

/**
 * Check if user can enter the house main area
 * Any authenticated user can enter
 */
export function canEnterHouse(user, adminUnlocked = false) {
  return canAccess(user, adminUnlocked, "entry");
}

/**
 * Get access status message for UI display
 */
export function getAccessMessage(user, adminUnlocked = false) {
  const level = getUserAccessLevel(user, adminUnlocked);

  switch (level) {
    case "admin":
      return "Admin Access Granted";
    case "premium":
      return "Premium Access";
    case "user":
      return "Standard Access";
    case "guest":
    default:
      return "Please sign in";
  }
}
