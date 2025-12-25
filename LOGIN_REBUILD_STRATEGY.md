# Login & Content System Rebuild Strategy
**Date**: December 24, 2025  
**Issue**: Authentication succeeds but UI doesn't update; content not displaying in Club Hollywood

---

## 🔴 Critical Issues Analysis

### Issue 1: Authentication State Not Triggering UI Updates

**Current Problems:**
1. Clerk authentication succeeds (`signIn.setActive()` completes)
2. ClerkAuthContext receives the user object
3. HeroDoor component doesn't detect the state change
4. "Enter House" button never appears

**Root Cause:**
- Multiple layers of state indirection (Clerk → ClerkAuthContext → HeroDoor)
- `useRef` for tracking previous state creates timing issues
- Effects running before Clerk fully syncs
- Props vs context confusion (`isSignedIn` prop vs `user` from context)

### Issue 2: Club Hollywood Content Not Loading

**Current Problems:**
1. User uploaded 3 mixes to Sanity
2. Content shows in Sanity Studio
3. VibePlayer queries but returns empty
4. Music player shows "No Tracks Available"

**Potential Root Causes:**
- Content not published (still in draft state)
- Wrong room ID assigned (user selected different room)
- Content using old schema field names
- Query perspective issue

---

## 🎯 New Strategy: Simplified Authentication Flow

### Phase 1: Direct Authentication (Remove Indirection)

**Current (Broken):**
```
SignInForm → Clerk → ClerkAuthContext → HeroDoor prop → useEffect → state change
```

**New (Direct):**
```
SignInForm → Clerk → Direct callback → HeroDoor → Show button immediately
```

**Implementation:**

```jsx
// HeroDoor.jsx - Simplified
export default function HeroDoor({ onEnterHouse }) {
  const { user, isLoaded } = useUser(); // Direct Clerk hook
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Simple: If user exists and loaded, show Enter button
  const canEnter = isLoaded && !!user;
  
  return (
    <RoomSection bg="/Frontdoor_Main.png">
      {!canEnter ? (
        // Show Sign In button
        <button onClick={() => setShowAuthModal(true)}>
          Sign In to Enter
        </button>
      ) : (
        // Show Enter House button
        <button onClick={onEnterHouse}>
          Enter House
        </button>
      )}
      
      {showAuthModal && (
        <AuthModal 
          onSuccess={() => {
            setShowAuthModal(false);
            // User state will update automatically via Clerk hook
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </RoomSection>
  );
}
```

**Key Changes:**
1. ✅ Use `useUser()` directly from Clerk (no wrapper context)
2. ✅ No `useRef`, no `prevState` tracking
3. ✅ No `useEffect` dependencies to manage
4. ✅ Direct conditional rendering based on `user` existence
5. ✅ Clerk's built-in reactivity handles everything

### Phase 2: Session Persistence (Already Built-in)

Clerk automatically persists via:
- Secure cookies
- localStorage
- JWT tokens

**No additional code needed!** Just ensure ClerkProvider is at root level.

### Phase 3: Simplified Context (Optional)

Keep ClerkAuthContext only for:
- Premium status checks
- Sign out functionality
- Supabase data operations

```jsx
// Minimal ClerkAuthContext
export function useAuth() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const isPremium = user?.publicMetadata?.premium === true;
  
  return { user, isLoaded, isPremium, signOut };
}
```

---

## 🎵 New Strategy: Reliable Content Loading

### Phase 1: Debug Content Publishing

**Immediate Action:**
1. Open Sanity Studio
2. Check if mixes are in "Drafts" or "Published"
3. If drafts → Click "Publish" button
4. Verify room field has `["club-main-stage"]` selected

**Query to test in Sanity Vision:**
```groq
*[_type == "mediaContent" && "club-main-stage" in room[] && defined(mediaFile.asset)] {
  _id,
  title,
  room,
  "hasMedia": defined(mediaFile.asset),
  "mediaUrl": mediaFile.asset->url
}
```

### Phase 2: Simplified Content Query

**Current (Complex):**
```jsx
const query = `*[_type == "mediaContent" && ($roomId in room[] || room == $roomId) && defined(mediaFile.asset)]`;
```

**New (Explicit):**
```jsx
const query = `*[_type == "mediaContent" && $roomId in room[]] {
  _id,
  title,
  "url": mediaFile.asset->url,
  "thumbnail": thumbnail.asset->url
}`;
```

**Changes:**
- Remove `|| room == $roomId` (array only)
- Simpler field projections
- Trust the schema (room is always array after migration)

### Phase 3: Content Loading Component

Create dedicated loader with clear states:

```jsx
function ContentLoader({ roomId, onLoad }) {
  const [status, setStatus] = useState('loading'); // loading | success | empty | error
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    setStatus('loading');
    
    sanityClient
      .fetch(`*[_type == "mediaContent" && $roomId in room[]]`, { roomId })
      .then(data => {
        if (data.length > 0) {
          setContent(data);
          setStatus('success');
          onLoad?.(data);
        } else {
          setStatus('empty');
        }
      })
      .catch(err => {
        console.error(err);
        setStatus('error');
      });
  }, [roomId]);
  
  return { status, content };
}
```

**Usage in VibePlayer:**
```jsx
function VibePlayer({ roomId }) {
  const { status, content } = useContentLoader({ roomId });
  
  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'empty') return <EmptyState />;
  if (status === 'error') return <ErrorState />;
  
  return <MusicPlayer tracks={content} />;
}
```

---

## 🛠️ Implementation Plan

### Step 1: Rebuild HeroDoor (30 mins)
- [ ] Remove all `useRef` and `prevState` logic
- [ ] Use `useUser()` directly from Clerk
- [ ] Simplify to: user exists = show button
- [ ] Remove unnecessary `useEffect` hooks
- [ ] Test sign in → should see button immediately

### Step 2: Verify Sanity Content (15 mins)
- [ ] Open Sanity Studio
- [ ] Check content publishing status
- [ ] Verify room field has correct values
- [ ] Test query in Vision tool
- [ ] Publish any drafts

### Step 3: Rebuild VibePlayer (20 mins)
- [ ] Create `useContentLoader` hook
- [ ] Simplify query (array syntax only)
- [ ] Add clear loading/error/empty states
- [ ] Test with Club Hollywood

### Step 4: Clean Up Context (15 mins)
- [ ] Simplify ClerkAuthContext
- [ ] Remove redundant transformations
- [ ] Keep only essential exports
- [ ] Update imports across app

### Step 5: Testing (30 mins)
- [ ] Test sign in flow (email + Google)
- [ ] Verify session persistence (reload page)
- [ ] Test Club Hollywood content loading
- [ ] Test other rooms with content
- [ ] Verify master key still works

**Total Time: ~2 hours**

---

## 📋 Migration Checklist

### Before Starting:
- [x] Current code committed and pushed
- [ ] Backup `.env.local` file
- [ ] Note current Clerk publishable key
- [ ] List all rooms using authentication

### During Migration:
- [ ] Work on feature branch: `git checkout -b fix/auth-rebuild`
- [ ] Test after each step
- [ ] Keep console logs for debugging
- [ ] Document any Sanity schema changes

### After Completion:
- [ ] Remove all debug console.logs
- [ ] Test on fresh browser (incognito)
- [ ] Test mobile responsiveness
- [ ] Verify all auth flows work
- [ ] Merge to main when stable

---

## 🎯 Expected Outcomes

### Authentication:
✅ Sign in → Button appears **immediately** (no delay)  
✅ Page reload → User stays signed in  
✅ Google OAuth → Returns to same page  
✅ Master key → Still works as bypass  

### Content:
✅ Published content → Shows in player  
✅ Multi-room → Same content in multiple locations  
✅ Empty rooms → Clear "No content" message  
✅ Loading states → Smooth user experience  

---

## 🚨 Rollback Plan

If new approach doesn't work:

```bash
# Revert to current state
git reset --hard origin/main

# Or revert specific commit
git revert HEAD
```

Keep old code in `*.legacy.jsx` files as reference.

---

## 💡 Key Principles for Rebuild

1. **Direct State Access**: Use Clerk hooks directly, not through wrappers
2. **Trust the Library**: Let Clerk handle reactivity and persistence
3. **Explicit States**: Loading, success, error, empty - always clear
4. **Simple Conditionals**: `if (user) show button` - no complex logic
5. **Minimal Effects**: Only when absolutely necessary
6. **Clear Naming**: No confusion between props and context

---

## 📝 Notes

- Clerk's `useUser()` hook is reactive - component re-renders when user changes
- No need for `useEffect` to watch user state - Clerk does this internally
- Session persistence is automatic - stored in cookies/localStorage
- OAuth redirects work better with `window.location.href` not `"/"`

---

**Ready to rebuild with confidence! 🚀**
