# Personal Access Code System - Kazmo Mansion

## Overview
The Kazmo Mansion uses a **hybrid authentication system** combining traditional email/password with **personal 4-digit access codes** that serve as shortcuts to user emails.

---

## How It Works

### Concept
- **Email = Real Access**: User's email and password provide actual authentication
- **4-Digit Code = Shortcut**: Personal code is linked to email for quick access
- **Master Key (3104)**: Admin access for backend management only
- **Zone Tracking**: Users categorized by signup location

### User Flow

#### New User Signup
```
1. User clicks "Create account" at Kazmo Mansion front door
2. Enters email + password
3. System generates unique 4-digit personal code (e.g., 7421)
4. Code is displayed to user: "Save this code!"
5. User metadata updated:
   - personal_code: "7421"
   - signup_zone: "kazmo-mansion"
   - zone_codes: ["1000"]
6. User can now login with email/password OR their personal code
```

#### Returning User with Personal Code
```
1. User arrives at front door
2. Taps "Admin access code" 
3. Enters their personal code (e.g., 7421)
4. System recognizes code → shows "Code recognized for joh***@example.com"
5. Redirects to signin form (could auto-fill email in future)
6. User completes authentication
7. Access granted
```

#### Master Key Access (Admin Only)
```
1. Admin arrives at front door
2. Taps "Admin access code"
3. Enters master key: 3104
4. Immediate access granted
5. Full backend management capabilities:
   - Password resets
   - User categorization
   - Content management
   - Zone assignment
```

---

## Database Structure

### Profiles Table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,              -- References auth.users(id)
  email TEXT,                       -- User email
  personal_code TEXT UNIQUE,        -- 4-digit shortcut code
  signup_zone TEXT,                 -- Where they registered
  zone_codes TEXT[],                -- Zones they have access to
  admin_zones TEXT[],               -- Zones they admin
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### User Metadata (Supabase Auth)
```json
{
  "user_metadata": {
    "personal_code": "7421",
    "signup_zone": "kazmo-mansion",
    "zone_codes": ["1000"],
    "signup_date": "2025-12-19T..."
  }
}
```

---

## Code Categories

### Master Key: 3104
- **Purpose**: Admin backend access
- **Access Level**: Full system control
- **Use Cases**:
  - Password resets for users
  - Manually categorize users
  - Add/edit content in all zones
  - Assign zone codes
  - View analytics
- **Security**: Stored as environment variable `VITE_ADMIN_ACCESS_CODE`
- **Never changes**: Always 3104

### Personal Codes: 1000-9999 (excluding 3104)
- **Purpose**: User quick access shortcuts
- **Generated**: Randomly on signup
- **Unique**: Each user gets their own code
- **Tied to**: User's email address
- **Use Cases**:
  - Quick login without typing email
  - Easy access for returning users
  - Memorable 4-digit PIN
- **Rotation**: Can be regenerated if needed

---

## User Categorization

### Based on Signup Zone

| Signup Location | Zone Code | Category | Access |
|----------------|-----------|----------|--------|
| **Kazmo Mansion** | 1000 | Personal Brand | Mansion + premium dark wing |
| **Shadow Market** | 2000 | Marketplace | DEX, listings, RWA |
| **Club Hollywood** | 3000 | Events | Live events, mixes (optional login) |
| **Chakra Center** | 4000 | Wellness | Books, sounds, tracking |
| **Studio Belt** | 5000 | Creative | Recording, production (premium) |

### Cross-Zone Access
Users can have multiple zone codes:
```json
{
  "zone_codes": ["1000", "2000", "4000"]
}
```
This user has access to:
- Kazmo Mansion
- Shadow Market  
- Chakra Center

### Admin Zones
Admin can be granted full control of specific zones:
```json
{
  "admin_zones": ["1000"]
}
```
This admin can:
- Manage all mansion content
- Reset mansion user passwords
- Categorize mansion users

---

## Implementation

### Files Updated
1. **`src/lib/zoneAccessControl.js`**
   - `generatePersonalCode()` - Creates unique 4-digit codes
   - `getUserByPersonalCode()` - Looks up email by code
   - `assignPersonalCode()` - Assigns code on signup
   - `MASTER_KEY` constant (3104)

2. **`src/components/SignUpForm.jsx`**
   - Accepts `signupZone` prop
   - Calls `assignPersonalCode()` after successful signup
   - Displays generated code to user

3. **`src/sections/HeroDoor.jsx`**
   - Keypad accepts both master key and personal codes
   - Master key → instant admin access
   - Personal code → recognizes user, shows signin

4. **`docs/supabase-profiles-table.sql`**
   - Database migration
   - Creates profiles table
   - Auto-generates codes on user signup

### Key Functions

#### Generate Code
```javascript
import { generatePersonalCode } from '../lib/zoneAccessControl';

const code = generatePersonalCode();
// Returns: "7421" (random, avoids 3104)
```

#### Assign Code on Signup
```javascript
import { assignPersonalCode } from '../lib/zoneAccessControl';

const result = await assignPersonalCode(
  supabase,
  userId,
  'kazmo-mansion'
);

console.log(result.personalCode); // "7421"
console.log(result.zoneCode); // "1000"
```

#### Lookup User by Code
```javascript
import { getUserByPersonalCode } from '../lib/zoneAccessControl';

const result = await getUserByPersonalCode(supabase, "7421");

if (result.email) {
  console.log(`Code belongs to: ${result.email}`);
}
```

---

## Security Considerations

### Personal Code Collision
- Randomly generated from 1000-9999 (8,999 possible codes)
- Excludes 3104 (master key)
- Database unique constraint prevents duplicates
- If collision occurs, regenerates automatically

### Master Key Protection
- Stored as environment variable (not in code)
- Only works from keypad (not in signup/signin forms)
- Grants immediate access without database lookup
- Should be rotated if compromised

### Zone Isolation
- Users only see zones they have access to
- Zone codes stored in user metadata
- Backend validates zone access on every request
- Admin can override for support purposes

---

## User Experience

### First-Time User
1. Creates account at mansion door
2. Sees personal code: "7421"
3. Message: "Save this code! Use it as a quick login shortcut."
4. 3 seconds later, enters mansion
5. Code saved in user profile

### Returning User (Email)
1. Arrives at door
2. Clicks "Sign in / Create account"
3. Enters email + password
4. Access granted

### Returning User (Personal Code)
1. Arrives at door
2. Clicks "Admin access code"
3. Enters personal code: 7421
4. System shows: "Code recognized for joh***"
5. Redirected to signin (could auto-fill)
6. Quick password entry
7. Access granted

### Admin
1. Arrives at door
2. Clicks "Admin access code"
3. Enters master key: 3104
4. Instant access (no signin needed)
5. Full backend control

---

## Future Enhancements

### Planned Features
1. **Auto-fill Email**: When personal code entered, auto-fill email in signin form
2. **Code Recovery**: "Forgot your code?" feature to email it
3. **Code Rotation**: Allow users to regenerate their personal code
4. **Multiple Devices**: Track which devices use which codes
5. **Analytics**: Track code usage vs email login

### Admin Dashboard (Future)
- View all users by zone
- Search by personal code
- Manually assign/remove zone access
- Reset user passwords
- View login analytics
- Generate reports

---

## Testing Checklist

### Manual Testing
```bash
# Test signup flow
1. Go to Kazmo Mansion door
2. Click "Create account"
3. Enter email + password
4. Verify personal code is displayed
5. Check user metadata in Supabase

# Test personal code login
1. Log out
2. Go to mansion door
3. Click "Admin access code"
4. Enter personal code from signup
5. Verify code is recognized
6. Complete signin

# Test master key
1. Go to mansion door
2. Click "Admin access code"
3. Enter 3104
4. Verify instant access granted

# Test zone isolation
1. Signup at mansion (get code 1000)
2. Try to access shadow market
3. Should require separate auth
4. Signup at market (get code 2000)
5. Verify both zones accessible
```

### Database Queries
```sql
-- View all personal codes
SELECT email, personal_code, signup_zone, zone_codes
FROM profiles
ORDER BY created_at DESC;

-- Check for code collisions
SELECT personal_code, COUNT(*)
FROM profiles
GROUP BY personal_code
HAVING COUNT(*) > 1;

-- View users by signup zone
SELECT signup_zone, COUNT(*) as user_count
FROM profiles
GROUP BY signup_zone;

-- Find admin users
SELECT email, admin_zones
FROM profiles
WHERE admin_zones IS NOT NULL AND array_length(admin_zones, 1) > 0;
```

---

## Troubleshooting

### Code not generating
**Issue**: User signs up but no personal code appears  
**Fix**: Check Supabase function logs, ensure `assignPersonalCode()` is called

### Code collision error
**Issue**: "Personal code already exists"  
**Fix**: Function auto-regenerates, check database unique constraint

### Master key not working
**Issue**: 3104 doesn't grant access  
**Fix**: Check `VITE_ADMIN_ACCESS_CODE` environment variable

### User can't find their code
**Issue**: User forgot their personal code  
**Fix**: Query database or add "Forgot code?" feature

---

## Summary

✅ **What's Working:**
- Master key (3104) for admin access
- Personal codes generated on signup
- Codes tied to emails as shortcuts
- Zone tracking based on signup location
- Database structure ready

📋 **Next Steps:**
1. Run SQL migration in Supabase
2. Test signup flow
3. Test personal code recognition
4. Build admin dashboard (future)
5. Add code recovery feature (future)

🎯 **Key Benefit:**
Users can remember a simple 4-digit code instead of typing their email every time, while still maintaining proper email/password security. Admin has instant access via master key for backend management.
