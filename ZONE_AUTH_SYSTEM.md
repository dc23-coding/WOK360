# WOK360 Zone-Based Authentication System

## Overview
WOK360 uses a **zone-based authentication** system where users enter the Universe Map directly without global authentication. Only specific zones require login, keeping zones independent and users separated by purpose.

---

## Authentication Flow

### Current Flow (NEW)
```
Entry → Universe Map (NO AUTH) → All Zones Visible
                                      ↓
                            Click on Zone
                                      ↓
                    ┌─────────────────┴─────────────────┐
                    ↓                                   ↓
            Requires Auth?                        No Auth Needed
            (Mansion, Market)                     (Club, Chakra)
                    ↓                                   ↓
            Zone-Specific Login                   Enter Directly
            (Gold signin/Wallet)
                    ↓
            Assign 4-Digit Code
                    ↓
            Enter Zone
```

---

## Zone Configuration

### Zone Codes (4-Digit System)
| Zone | Code Range | Auth Required | Method |
|------|-----------|---------------|---------|
| **Kazmo Mansion** | 1000-1999 | ✅ Yes | Gold-plated signin |
| **Shadow Market** | 2000-2999 | ✅ Yes | Email/Wallet |
| **Club Hollywood** | 3000-3999 | ❌ No | Optional login for features |
| **Chakra Center** | 4000-4999 | ❌ No | Premium for tracking |
| **Studio Belt** | 5000-5999 | ❌ Premium | Premium subscription |
| **AI Arcane** | 6000-6999 | ❌ No | Premium for advanced |

### Zone Definitions (`src/universe/data/regions.js`)
```javascript
{
  id: "kazmo-mansion",
  requiredAccess: "authenticated", // Login required
  zoneCode: "1000", // 4-digit code
  allowWalletAuth: false // Email only (gold signin)
}
```

---

## User Categorization

### Purpose
- **Separate user bases** per zone
- Shadow Market users ≠ Mansion users
- Users can have access to multiple zones
- Businesses can use Shadow Market without mansion affiliation

### Zone Codes in User Metadata
```javascript
user.user_metadata = {
  zone_codes: ["1000", "2000"], // Has access to Mansion + Market
  admin_zones: ["1000"], // Admin in Mansion
  premium: true
}
```

### Granting Zone Access
```javascript
import { grantZoneAccess, ZONE_CODES } from '../lib/zoneAccessControl';

// On first login to Shadow Market
await grantZoneAccess(supabase, userId, ZONE_CODES.SHADOW_MARKET);
```

---

## Authentication Methods

### 1. Kazmo Mansion (1000)
- **Method**: Gold-plated email signin (existing HeroDoor component)
- **Flow**: 
  1. User clicks "Enter Kazmo Mansion"
  2. Shows HeroDoor with gold-plated tablet
  3. Email/password or admin code (3104)
  4. Assigns zone code `1000` on success
  5. Enters mansion
- **Location**: `src/sections/HeroDoor.jsx`

### 2. Shadow Market (2000)
- **Method**: Email signin + Wallet connect (optional)
- **Flow**:
  1. User clicks "Enter Shadow Market"
  2. Shows marketplace auth (simple form)
  3. Email/password OR wallet connect
  4. Assigns zone code `2000` on success
  5. Enters market
- **Wallet Integration**: Coinbase Wallet, MetaMask, WalletConnect

### 3. Club Hollywood (3000)
- **Method**: Optional login
- **Flow**:
  1. User clicks "Enter Club Hollywood"
  2. Enters directly (no gate)
  3. If logged in → enhanced features (chat, reactions)
  4. If not logged in → basic viewing only

### 4. Chakra Center (4000)
- **Method**: Optional login
- **Flow**:
  1. Enter directly for content
  2. Premium users can track health data
  3. Free users get read-only access

---

## Security & Scalability

### No Direct Money Handling
- All payments through third-party (Coinbase, Stripe)
- Donations via QR codes (crypto addresses)
- DEX uses smart contracts (no custodial)

### Zone Isolation
```javascript
// Check if user has zone access
if (!hasZoneAccess(user, ZONE_CODES.SHADOW_MARKET)) {
  // Redirect to auth
}
```

### Admin Overrides
```javascript
// Admin can access any zone
if (isZoneAdmin(user, zoneCode)) {
  // Grant access
}
```

### Future-Proof
- Add new zones by adding to `ZONE_CODES`
- Configure in `regions.js`
- Implement zone-specific auth in world component

---

## Implementation Checklist

### ✅ Phase 1: Core Authentication (COMPLETED)
- [x] Remove global authentication requirement
- [x] Create zone access control library
- [x] Update regions.js with zone codes
- [x] Update UniversePage to allow direct access
- [x] Add authentication badges to RegionCard

### 🔄 Phase 2: Kazmo Mansion (IN PROGRESS)
- [ ] Keep existing gold-plated signin
- [ ] Integrate zone code assignment on login
- [ ] Test admin code access
- [ ] Verify premium dark wing access

### 📋 Phase 3: Shadow Market (PENDING)
- [ ] Create marketplace auth component
- [ ] Integrate wallet connect (Coinbase/MetaMask)
- [ ] Add QR code donation system
- [ ] Assign zone code 2000 on login
- [ ] Implement DEX interface

### 📋 Phase 4: Club Hollywood (PENDING)
- [ ] Verify no-auth entry works
- [ ] Add "enhanced for logged-in" features
- [ ] Test mix selection + video moods
- [ ] Implement live event system

### 📋 Phase 5: Chakra Center (PENDING)
- [ ] Design unique interface (different from Club)
- [ ] Implement binaural sounds library
- [ ] Create book reader frame
- [ ] Add health input form (weight, medical)
- [ ] Connect to AI Arcane for advice
- [ ] Premium tracking system

### 📋 Phase 6: Backend Integration
- [ ] Sanity CMS schemas for each zone
- [ ] API tier system (basic/premium)
- [ ] Usage tracking per zone

---

## Code Locations

| Component | Location | Purpose |
|-----------|----------|---------|
| Zone Access Control | `src/lib/zoneAccessControl.js` | Core auth logic |
| Universe Map | `src/universe/UniversePage.jsx` | Entry point (no auth) |
| Regions Config | `src/universe/data/regions.js` | Zone definitions |
| Kazmo Auth | `src/sections/HeroDoor.jsx` | Gold-plated signin |
| Shadow Market Auth | `src/worlds/shadowMarket/` | Wallet + email |
| Auth Context | `src/context/SupabaseAuthContext.jsx` | Global auth state |

---

## API Structure

### User Metadata Schema
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "user_metadata": {
    "zone_codes": ["1000", "2000"],
    "admin_zones": ["1000"],
    "premium": true,
    "wallet_address": "0x..."
  },
  "app_metadata": {
    "premium": true,
    "subscription_tier": "premium"
  }
}
```

### Zone Access Check
```javascript
import { hasZoneAccess, ZONE_CODES } from '../lib/zoneAccessControl';

// In world component
useEffect(() => {
  if (!hasZoneAccess(user, ZONE_CODES.KAZMO_MANSION)) {
    // Show auth gate
  }
}, [user]);
```

---

## Premium Features

### Per-Zone Premium
- **Mansion**: Dark Wing access
- **Shadow Market**: Advanced trading tools
- **Club Hollywood**: Priority seating, chat features
- **Chakra Center**: Health tracking, AI plans
- **AI Arcane**: Extended conversations, memory

### API Tiers
- **Free**: Basic access, limited API calls
- **Basic**: More API calls, basic features
- **Premium**: Unlimited API, all features, tracking

---

## Testing

### Manual Testing Checklist
```bash
# Test direct universe access
1. Open app → Should see Universe Map (no auth)
2. Click on Club Hollywood → Should enter directly
3. Click on Kazmo Mansion → Should see gold signin
4. Click on Shadow Market → Should see marketplace auth

# Test zone isolation
5. Login to Mansion → Check zone_codes includes "1000"
6. Login to Shadow Market → Check zone_codes includes "2000"
7. Verify separate user bases don't cross-contaminate
```

---

## Future Enhancements

### Wallet Integration
- Coinbase Wallet SDK
- MetaMask integration
- WalletConnect protocol
- QR code generation for donations

### Social Features
- Zone-specific chat rooms
- User profiles per zone
- Cross-zone interactions (optional)

### Business Tools (Shadow Market)
- Merchant dashboards
- Product listings
- Analytics
- Escrow system

---

## Troubleshooting

### User can't enter authenticated zone
```javascript
// Check zone codes
console.log(user.user_metadata?.zone_codes);

// Grant access manually
await grantZoneAccess(supabase, userId, "1000");
```

### Zone codes not persisting
- Verify Supabase updateUser is called
- Check user_metadata in Supabase dashboard
- Ensure auth context is wrapping app

### Premium not working
- Check `app_metadata.premium === true`
- Verify admin can override
- Test with admin code (3104)

---

## Contact & Support
For questions about the zone authentication system, refer to the implementation order in the project root or check the code comments in `zoneAccessControl.js`.
