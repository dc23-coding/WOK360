// src/lib/zoneAccessControl.js
// Zone-based access control system for WOK360 Universe
// Users are categorized by 4-digit zone codes to keep zones separate

/**
 * Zone Code Structure:
 * - 1000-1999: Kazmo Mansion (Personal Brand)
 * - 2000-2999: Shadow Market (Marketplace/DEX)
 * - 3000-3999: Club Hollywood (Live Events)
 * - 4000-4999: Chakra Center (Wellness)
 * - 5000-5999: Studio Belt (Creative)
 * - 6000-6999: AI Arcane (AI Hub)
 * - 7000+: Future zones
 * 
 * Personal Access Codes:
 * - 4-digit codes are shortcuts to user's email
 * - Generated on signup, unique per user
 * - Stored in user_metadata.personal_code
 * - Master code (3104) for admin access only
 */

export const ZONE_CODES = {
  KAZMO_MANSION: "1000",
  SHADOW_MARKET: "2000",
  CLUB_HOLLYWOOD: "3000",
  CHAKRA_CENTER: "4000",
  STUDIO_BELT: "5000",
  AI_ARCANE: "6000",
};

export const MASTER_KEY = "3104"; // Admin access only

/**
 * Check if user has access to a specific zone
 * @param {Object} user - User object from Supabase
 * @param {string} zoneCode - 4-digit zone code
 * @returns {boolean}
 */
export function hasZoneAccess(user, zoneCode) {
  if (!user) return false;
  
  // Check user metadata for zone codes
  const userZones = user.user_metadata?.zone_codes || [];
  return userZones.includes(zoneCode);
}

/**
 * Add zone access to user's metadata
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {string} zoneCode - 4-digit zone code
 */
export async function grantZoneAccess(supabase, userId, zoneCode) {
  try {
    const { data: user, error: fetchError } = await supabase.auth.getUser();
    
    if (fetchError) throw fetchError;
    
    const currentZones = user.user.user_metadata?.zone_codes || [];
    
    // Don't duplicate
    if (currentZones.includes(zoneCode)) {
      return { success: true, message: "Zone access already granted" };
    }
    
    const updatedZones = [...currentZones, zoneCode];
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: { zone_codes: updatedZones }
    });
    
    if (updateError) throw updateError;
    
    return { success: true, message: "Zone access granted" };
  } catch (error) {
    console.error("Error granting zone access:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Remove zone access from user's metadata
 * @param {Object} supabase - Supabase client
 * @param {string} userId - User ID
 * @param {string} zoneCode - 4-digit zone code
 */
export async function revokeZoneAccess(supabase, userId, zoneCode) {
  try {
    const { data: user, error: fetchError } = await supabase.auth.getUser();
    
    if (fetchError) throw fetchError;
    
    const currentZones = user.user.user_metadata?.zone_codes || [];
    const updatedZones = currentZones.filter(code => code !== zoneCode);
    
    const { error: updateError } = await supabase.auth.updateUser({
      data: { zone_codes: updatedZones }
    });
    
    if (updateError) throw updateError;
    
    return { success: true, message: "Zone access revoked" };
  } catch (error) {
    console.error("Error revoking zone access:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all zones user has access to
 * @param {Object} user - User object from Supabase
 * @returns {Array<string>} Array of zone codes
 */
export function getUserZones(user) {
  if (!user) return [];
  return user.user_metadata?.zone_codes || [];
}

/**
 * Check if user is a zone admin (has all access within a zone)
 * @param {Object} user - User object from Supabase
 * @param {string} zoneCode - 4-digit zone code
 * @returns {boolean}
 */
export function isZoneAdmin(user, zoneCode) {
  if (!user) return false;
  
  const adminZones = user.user_metadata?.admin_zones || [];
  return adminZones.includes(zoneCode);
}

/**
 * Generate a unique 4-digit personal access code for a user
 * Code is a shortcut to their email for quick access
 * @returns {string} 4-digit code (avoiding master key)
 */
export function generatePersonalCode() {
  let code;
  do {
    // Generate random 4-digit code
    code = Math.floor(1000 + Math.random() * 9000).toString();
  } while (code === MASTER_KEY); // Avoid master key collision
  
  return code;
}

/**
 * Check if a personal code exists and get associated email
 * @param {Object} supabase - Supabase client
 * @param {string} code - 4-digit personal code
 * @returns {Promise<{email: string|null, user: Object|null}>}
 */
export async function getUserByPersonalCode(supabase, code) {
  try {
    // Query users table for matching personal_code
    const { data, error } = await supabase
      .from('profiles') // Assuming you have a profiles table
      .select('email, id')
      .eq('personal_code', code)
      .single();
    
    if (error || !data) {
      return { email: null, user: null };
    }
    
    return { email: data.email, user: data };
  } catch (error) {
    console.error('Error fetching user by personal code:', error);
    return { email: null, user: null };
  }
}

/**
 * Assign personal code to user on signup (Clerk version)
 * @param {Object} supabase - Supabase client (for profiles table)
 * @param {string} userId - Clerk User ID
 * @param {string} signupZone - Zone where user signed up (world ID)
 * @param {string} userEmail - User's email address
 */
export async function assignPersonalCode(supabase, userId, signupZone, userEmail = null) {
  try {
    const personalCode = generatePersonalCode();
    
    // Determine zone code based on signup location
    let zoneCode;
    switch (signupZone) {
      case 'kazmo-mansion':
        zoneCode = ZONE_CODES.KAZMO_MANSION;
        break;
      case 'shadow-market':
        zoneCode = ZONE_CODES.SHADOW_MARKET;
        break;
      case 'club-hollywood':
        zoneCode = ZONE_CODES.CLUB_HOLLYWOOD;
        break;
      case 'chakra-center':
        zoneCode = ZONE_CODES.CHAKRA_CENTER;
        break;
      default:
        zoneCode = ZONE_CODES.KAZMO_MANSION; // Default to mansion
    }
    
    // Store personal code in Supabase profiles table
    // NOTE: Clerk user metadata should be updated via Clerk API on backend
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: userEmail,
        personal_code: personalCode,
        signup_zone: signupZone,
        zone_code: zoneCode,
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });
    
    if (upsertError) {
      console.error('Error upserting profile:', upsertError);
      // Don't throw - still return the code
    }
    
    return { success: true, personalCode, zoneCode };
  } catch (error) {
    console.error('Error assigning personal code:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Assign user to a zone on first authentication
 * Used when user logs in for the first time to a specific zone
 * @param {Object} supabase - Supabase client
 * @param {string} worldId - World/zone ID
 */
export async function assignUserToZone(supabase, worldId) {
  let zoneCode;
  
  // Map world IDs to zone codes
  switch (worldId) {
    case "kazmo-mansion":
      zoneCode = ZONE_CODES.KAZMO_MANSION;
      break;
    case "shadow-market":
      zoneCode = ZONE_CODES.SHADOW_MARKET;
      break;
    case "club-hollywood":
      zoneCode = ZONE_CODES.CLUB_HOLLYWOOD;
      break;
    case "chakra-center":
      zoneCode = ZONE_CODES.CHAKRA_CENTER;
      break;
    case "studio-belt":
      zoneCode = ZONE_CODES.STUDIO_BELT;
      break;
    case "ai-arcane":
      zoneCode = ZONE_CODES.AI_ARCANE;
      break;
    default:
      return { success: false, error: "Unknown zone" };
  }
  
  return await grantZoneAccess(supabase, null, zoneCode);
}

/**
 * Check if a zone requires authentication
 * @param {string} worldId - World/zone ID
 * @param {Object} region - Region data from regions.js
 * @returns {boolean}
 */
export function requiresAuthentication(region) {
  return region?.requiredAccess === "authenticated";
}

/**
 * Check if zone supports wallet authentication
 * @param {Object} region - Region data from regions.js
 * @returns {boolean}
 */
export function supportsWalletAuth(region) {
  return region?.allowWalletAuth === true;
}
