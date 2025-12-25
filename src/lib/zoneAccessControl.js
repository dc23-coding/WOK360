// src/lib/zoneAccessControl.js
// Zone access control utilities

export const MASTER_KEY = "3104";

export const ZONE_IDS = {
  KAZMO_MANSION: "kazmo-mansion",
  CLUB_HOLLYWOOD: "club-hollywood",
  SHADOW_MARKET: "shadow-market",
  CHAKRA_CENTER: "chakra-center"
};

export const ACCESS_LEVELS = {
  USER: "user",
  PREMIUM: "premium",
  ADMIN: "admin"
};

// Check if user has access to a specific zone
export function hasZoneAccess(user, zoneId) {
  if (!user) return false;
  if (user.access_level === ACCESS_LEVELS.ADMIN) return true;
  return user.access_zones?.includes(zoneId) || false;
}

// Check if user has required access level
export function hasAccessLevel(user, requiredLevel) {
  if (!user) return false;
  
  const levels = {
    [ACCESS_LEVELS.USER]: 1,
    [ACCESS_LEVELS.PREMIUM]: 2,
    [ACCESS_LEVELS.ADMIN]: 3
  };
  
  return levels[user.access_level] >= levels[requiredLevel];
}

// Get current user from localStorage
export function getCurrentUser() {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (err) {
    console.error("Error parsing user:", err);
    return null;
  }
}

// Check if admin (master key or admin account)
export function isAdmin() {
  const adminFlag = localStorage.getItem('isAdmin');
  if (adminFlag === 'true') return true;
  
  const user = getCurrentUser();
  return user?.access_level === ACCESS_LEVELS.ADMIN;
}

// Clear user session
export function clearUserSession() {
  localStorage.removeItem('accessCode');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('isAdmin');
}
