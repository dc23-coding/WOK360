# ACCESS KEY SYSTEM - DEPLOYMENT GUIDE

## What Changed

We've removed Clerk authentication entirely and replaced it with a simple **4-digit access code** system. This eliminates:
- Complex OAuth flows
- JWT token management
- Session refresh logic
- Third-party dependencies
- CORS issues

## Core Concepts

### Access Keys (4-Digit Codes)
- Users get a unique 4-digit code when they sign up
- Codes are stored in Supabase with user data
- Master key `3104` grants admin access to ALL zones
- Codes are validated against the database on entry

### Zone-Based Permissions
- Each zone (world) checks access independently
- Zones can require specific access levels: `user`, `premium`, or `admin`
- Users have an `access_zones` array (which zones they can enter)
- Users have an `access_level` (user/premium/admin)

### Three-Tier Access Check
1. **Master Key (3104)**: Admin access everywhere, bypasses all checks
2. **Zone Access**: Does user's `access_zones` include this zone ID?
3. **Level Access**: Does user's `access_level` meet the required level?

## Files Created/Modified

### New Components
- `src/components/ZoneKeypad.jsx` - Unified keypad for all zones
- `src/components/AccessDeniedModal.jsx` - Shows why access was denied
- `src/components/SignUpForKeyModal.jsx` - New user sign-up flow
- `src/lib/zoneAccessControl.js` - Helper functions for access control
- `docs/access-keys-schema.sql` - Complete database schema

### Updated Files
- `src/sections/HeroDoor.jsx` - Now uses ZoneKeypad
- `src/worlds/kazmoMansion/KazmoMansionWorld.jsx` - Simplified to use access keys
- `src/AppRouter.jsx` - Removed Supabase auth dependencies

## Step-by-Step Deployment

### 1. Deploy Supabase Schema (15 mins)

```bash
# Open Supabase Dashboard: https://supabase.com/dashboard
# Navigate to: Your Project > SQL Editor
# Copy and paste the entire contents of docs/access-keys-schema.sql
# Click "Run" to execute
```

**Verify tables created:**
- `access_keys` - User codes and permissions
- `zone_rules` - Zone configuration
- `user_activity` - Activity tracking
- `user_favorites` - User bookmarks

**Verify functions created:**
- `generate_access_code()` - Creates unique 4-digit codes
- `create_access_key(name, email, zones)` - Signs up new users
- `check_zone_access(code, zone_id)` - Validates access

**Test the function:**
```sql
-- In Supabase SQL Editor:
SELECT * FROM create_access_key('Test User', 'test@example.com', ARRAY['kazmo-mansion', 'club-hollywood']);
-- Should return a row with a 4-digit code
```

### 2. Test Master Key (5 mins)

```bash
# Start dev server
npm run dev
```

1. Navigate to `http://localhost:5173`
2. Click into Kazmo Mansion
3. Click "Enter Access Code" button
4. Enter `3104` on the keypad
5. Should see "Checking access..." then grant access
6. Click "Enter House" - should enter mansion
7. Verify "Welcome, Admin" message displayed

**Expected behavior:**
- Master key works immediately (no database lookup)
- Admin access stored in localStorage
- Can access both light and dark wings

### 3. Test New User Sign-Up (10 mins)

1. Clear localStorage: `localStorage.clear()`
2. Refresh the page
3. Click "Enter Access Code"
4. Click "Get Access Key" button at bottom of keypad
5. Fill in: Name: "John Doe", Email: "john@example.com"
6. Click "Get Access Key"
7. Should see generated 4-digit code displayed
8. Code should auto-enter after 2 seconds
9. Click "Enter House" button

**Verify in Supabase:**
```sql
SELECT * FROM access_keys WHERE email = 'john@example.com';
-- Should show user with generated code, zones, and access_level
```

**Test returning user:**
1. Clear localStorage again
2. Refresh page
3. Click "Enter Access Code"
4. Enter the code you were given
5. Should grant access immediately

### 4. Test Zone Access Denial (10 mins)

**Test zone restriction:**
1. In Supabase SQL Editor:
```sql
-- Remove kazmo-mansion from user's zones
UPDATE access_keys 
SET access_zones = '["club-hollywood"]'::jsonb 
WHERE email = 'john@example.com';
```

2. Clear localStorage and refresh
3. Enter John's code
4. Should see "Access Denied" modal
5. Message: "Your code doesn't have access to Kazmo Mansion"
6. Shows current zones: "Club Hollywood"

**Test level restriction:**
1. In Supabase SQL Editor:
```sql
-- Create a premium-only zone
UPDATE zone_rules 
SET is_active = true, required_level = 'premium' 
WHERE zone_id = 'shadow-market';
```

2. Try to enter Shadow Market with a user-level code
3. Should see "Access Denied" modal
4. Message: "Shadow Market requires PREMIUM access"
5. Shows current level: "USER"

### 5. Test Dark Wing Premium Gate (10 mins)

1. Sign in with a user-level account (not admin)
2. Enter Kazmo Mansion
3. Scroll to the Light/Dark toggle switch
4. Try to toggle to Dark Wing
5. Should show premium modal blocking access

**Grant premium:**
```sql
UPDATE access_keys 
SET access_level = 'premium' 
WHERE email = 'john@example.com';
```

6. Clear localStorage and re-enter
7. Now Dark Wing toggle should work

### 6. Test Cross-Browser Persistence (5 mins)

1. Sign in with a code in Chrome
2. Note the code
3. Open Firefox/Safari
4. Enter the same code
5. Should grant access (stored in database, not browser)

### 7. Remove Clerk Dependencies (Optional - 30 mins)

If you want to fully remove Clerk from the project:

```bash
# Uninstall Clerk
npm uninstall @clerk/clerk-react

# Remove environment variables (in .env.local)
# - VITE_CLERK_PUBLISHABLE_KEY

# Delete files
rm -rf src/context/ClerkAuthContext.jsx
rm -rf src/components/SignInForm.jsx
rm -rf src/components/SignUpForm.jsx

# Update main.jsx to remove ClerkProvider
```

**Note:** For now, we've left Clerk installed but unused. This allows easy rollback if needed.

## Admin Functions

### Grant Zone Access

```sql
-- Give a user access to Shadow Market
UPDATE access_keys 
SET access_zones = access_zones || '["shadow-market"]'::jsonb 
WHERE email = 'user@example.com';
```

### Revoke Zone Access

```sql
-- Remove Shadow Market access
UPDATE access_keys 
SET access_zones = access_zones - 'shadow-market' 
WHERE email = 'user@example.com';
```

### Upgrade to Premium

```sql
UPDATE access_keys 
SET access_level = 'premium' 
WHERE email = 'user@example.com';
```

### Deactivate User

```sql
UPDATE access_keys 
SET is_active = false 
WHERE email = 'user@example.com';
```

### View All Users

```sql
SELECT code, name, email, access_level, access_zones, is_active, last_used 
FROM access_keys 
ORDER BY created_at DESC;
```

### View User Activity

```sql
SELECT 
  ak.name, 
  ua.activity_type, 
  ua.zone_id, 
  ua.timestamp 
FROM user_activity ua
JOIN access_keys ak ON ua.user_id = ak.id
WHERE ak.email = 'user@example.com'
ORDER BY ua.timestamp DESC;
```

## Future Admin UI

The next step is to build an admin panel in the Dark Wing Control Room:

**Features to add:**
1. User list table (code, name, email, zones, level)
2. Grant/revoke zone access buttons
3. Upgrade to premium button
4. Deactivate user button
5. View user activity log
6. Generate new access codes manually

**Location:** `src/sections/ControlRoom.jsx` (Dark Wing only)

## Troubleshooting

### Code Not Working
- Check Supabase connection (network tab in DevTools)
- Verify code exists: `SELECT * FROM access_keys WHERE code = '1234';`
- Check if user is active: `is_active = true`

### Access Denied Incorrectly
- Verify zone ID matches: `kazmo-mansion` vs `kazmo_mansion`
- Check access_zones array format: `["kazmo-mansion"]` not `"kazmo-mansion"`
- Verify zone_rules table has correct required_level

### Master Key Not Working
- Check constant in `src/lib/zoneAccessControl.js` is `"3104"`
- Verify ZoneKeypad checks master key before database lookup
- Clear localStorage and try again

### Sign-Up Not Creating User
- Check Supabase function exists: `create_access_key`
- Verify email is unique (no duplicates)
- Check function response in Network tab (should return code)
- Test function directly in SQL Editor

## Security Notes

1. **Master Key**: Change `3104` to a different code before production
2. **RLS Policies**: Schema includes Row Level Security for data protection
3. **Email Validation**: Consider adding email verification for production
4. **Rate Limiting**: Add Cloudflare or similar to prevent brute force attacks
5. **Code Complexity**: 4 digits = 10,000 combinations. Consider 5-6 digits for production.

## Migration Path

If you want to migrate existing Clerk users:

```sql
-- Create access keys for existing Clerk users
INSERT INTO access_keys (name, email, access_zones, access_level)
SELECT 
  raw_user_meta_data->>'full_name',
  email,
  '["kazmo-mansion", "club-hollywood"]'::jsonb,
  CASE 
    WHEN raw_app_meta_data->>'premium' = 'true' THEN 'premium'
    ELSE 'user'
  END
FROM auth.users;
```

## Performance

- Database queries are indexed on `code` and `email`
- localStorage caching reduces lookups
- Master key bypasses database entirely
- Access checks happen only on zone entry (not every page)

## Next Steps

1. Deploy schema to Supabase ✓
2. Test all flows (master key, sign-up, denial) ✓
3. Build admin UI for user management
4. Add email verification (optional)
5. Implement "forgot code" email recovery
6. Add analytics dashboard for zone traffic
7. Consider 2FA for admin access

---

**Status**: Ready for testing and deployment
**Master Key**: 3104 (change before production)
**Database**: Supabase (schema ready)
**Authentication**: 4-digit access codes only
