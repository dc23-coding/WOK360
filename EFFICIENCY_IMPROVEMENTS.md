# WOK360 Efficiency & Access Control Improvements

## Current State Analysis

### Architecture Overview
- **Auth**: Supabase session management via SupabaseAuthContext
- **Access Control**: Three paths (email/password login, 4-digit access code, admin keypad)
- **Premium Access**: Managed via `user.app_metadata.premium` (boolean)
- **Theme Toggle**: Light/Dark mode with premium gating

### Identified Efficiency Issues

#### 1. **Duplicated Premium Logic**
- App.jsx calculates `isPremium = user?.app_metadata?.premium === true`
- LightHallway also checks premium independently
- DarkHallway doesn't check but relies on parent's canAccessDark
- **Impact**: Recalculation on every render, potential inconsistency

#### 2. **Missing Loading State During Code Submission**
- `handleDigit()` in HeroDoor submits code without preventing double-clicks
- User sees "Access denied" but doesn't know if request is still processing
- **Impact**: Poor UX, possible duplicate submissions to database

#### 3. **Fragmented Premium Modal Logic**
- App.jsx has `showPremiumModal` state
- LightHallway has its own fallback premium modal
- No consistency in how premium denial is communicated
- **Impact**: Code duplication, maintenance burden

#### 4. **No Unified Access Checker**
- Each component checks access independently
- Three different checks: `canEnter`, `canAccessDark`, `isPremium`
- No single source of truth for "what access does this user have?"
- **Impact**: Hard to maintain, easy to introduce bugs

#### 5. **App.jsx Handles Too Much**
- Manages mode toggle, premium modal, animations, scroll behavior
- Passes multiple props/handlers to child components
- **Impact**: Complexity, tightly coupled components

---

## Recommended Improvements

### Priority 1: Enhance Auth Context (HIGH IMPACT)

**File**: `src/context/SupabaseAuthContext.jsx`

**Changes**:
- Export `isPremium` directly from context (memoized)
- Add `canAccess(level)` helper method
- Expose admin status tracking (for future keypad persistence)

**Benefits**:
- Single source of truth for premium status
- Eliminates recalculation on every render
- Easier to test access logic

### Priority 2: Add Loading State to Keypad (MEDIUM IMPACT)

**File**: `src/sections/HeroDoor.jsx`

**Changes**:
- Add `isSubmitting` state during code verification
- Disable keypad digits while submitting
- Show pending UI (e.g., dimmed buttons, spinner)

**Benefits**:
- Prevents double-submission
- Clearer UX feedback
- Safer RPC calls to Supabase

### Priority 3: Create Access Helper Utility (MEDIUM IMPACT)

**File**: `src/lib/accessControl.js` (new file)

**Purpose**:
```javascript
// Check if user has specific access level
// accessLevel: 'entry' (needs auth or code), 'premium' (needs premium or admin)
export function canAccess(user, adminUnlocked, accessLevel) {
  if (accessLevel === 'entry') {
    return !!user || adminUnlocked;
  }
  if (accessLevel === 'premium') {
    return user?.app_metadata?.premium === true || adminUnlocked;
  }
  return false;
}
```

**Benefits**:
- Centralized access logic
- Easier to audit security
- Easier to add new access levels later

### Priority 4: Simplify App.jsx (LOW PRIORITY)

**Changes**:
- Remove `showPremiumModal` state
- Let LightHallway handle premium gating locally
- Reduce prop drilling

**Benefits**:
- Smaller component, easier to read
- LightHallway more self-contained
- Less prop passing

---

## Implementation Timeline

1. ✅ Enhance `SupabaseAuthContext` → test isPremium export
2. ✅ Add loading state to HeroDoor keypad → verify no double-submit
3. ✅ Create `src/lib/accessControl.js` → test helper function
4. ⭐ Update LightHallway/DarkHallway to use context isPremium
5. ⭐ Remove showPremiumModal from App.jsx (if LightHallway has it)
6. ⭐ Test full flow: auth login → premium access → dark mode toggle

---

## Code Examples

### Enhanced Auth Context
```javascript
// In SupabaseAuthProvider
const isPremium = useMemo(
  () => user?.app_metadata?.premium === true,
  [user?.app_metadata?.premium]
);

const value = {
  supabase,
  session,
  user,
  loading,
  isPremium,  // NEW
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signOut,
};
```

### Loading State in HeroDoor
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleDigit = async (digit) => {
  if (isSubmitting || code.length >= 4) return;
  
  const next = code + digit;
  setCode(next);

  if (next.length === 4) {
    setIsSubmitting(true);
    const result = await submitAccessCode(next);
    setIsSubmitting(false);
    // ... handle result
  }
};
```

### Access Control Utility
```javascript
// src/lib/accessControl.js
export function canAccess(user, adminUnlocked, accessLevel) {
  const isAuthenticated = !!user;
  const isPremium = user?.app_metadata?.premium === true;

  switch (accessLevel) {
    case 'entry':
      return isAuthenticated || adminUnlocked;
    case 'premium':
      return isPremium || adminUnlocked;
    default:
      return false;
  }
}
```

---

## Testing Checklist

- [ ] Non-premium user attempts to access dark mode → sees premium modal
- [ ] Premium user toggles to dark mode → door animation plays, no scroll
- [ ] Admin uses keypad → gains access, can toggle to dark mode
- [ ] Access code verified → user marked premium, can toggle dark mode
- [ ] Rapid keypad clicks → only one submission processed
- [ ] Page reload → mode persists, premium status retained

---

## Next Steps

1. Update `SupabaseAuthContext.jsx` to export `isPremium`
2. Update `HeroDoor.jsx` to add `isSubmitting` state
3. Create `src/lib/accessControl.js` utility
4. Test complete flow
5. Optional: Refactor App.jsx premium modal to LightHallway
