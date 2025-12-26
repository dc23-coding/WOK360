# Known Issues - WOK360

## 🚨 CRITICAL: Browser Glitch on Zone Cycling (Dec 26, 2025)

### Problem Description
**Instant browser glitching** when cycling through worlds/zones in the universe map. The glitch occurs immediately, not after prolonged use, suggesting a rendering or state management issue rather than memory accumulation.

### What We've Tried (All Failed)
1. ✅ **Image Optimization** (98% reduction: 40MB → 1MB) - Did not fix
2. ✅ **Removed ALL Framer Motion animations** - Did not fix
   - Removed AnimatePresence from AppRouter
   - Removed motion.div wrappers from world transitions
   - Removed infinite animations (orbital rotation, star pulses, globe scaling)
   - Removed hover/tap animations from all buttons
3. ✅ **Code-split Chakra Center into zones** - Did not fix
4. ✅ **Removed console.log spam** - Did not fix
5. ❌ **Deferred loading with setTimeout** - Made it WORSE

### Current State
- **Working Zones**: Kazmo Mansion, Club Hollywood
- **Glitching**: Universe map cycling, potentially Chakra Center, Shadow Market, Studio Belt, Arcane Tower
- **Performance Optimizations Applied**: All images WebP, no animations, lazy-loaded worlds, interval cleanup

### Suspect Causes
Given that the glitch is **instant** and persists after all optimizations:
1. **React State Race Condition**: Rapid zone switching with Suspense boundaries
2. **CSS/Transform Overflow**: Multiple full-viewport transforms or z-index stacking
3. **Sanity Client**: Possible unclosed connections or query batching issues
4. **Browser Extension Conflict**: Wallet extensions (Phantom/Solflare) injecting code
5. **New Addition**: Something added recently (post-Dec 20) introduced the bug

### Recommended Next Steps
1. **Rollback Strategy**: Remove unstable zones temporarily
2. **Isolation Test**: Test ONLY Mansion + Club Hollywood to confirm they work
3. **Git Bisect**: Find exact commit that introduced the issue
4. **Performance Profiling**: Chrome DevTools Performance tab during glitch
5. **Simplify AppRouter**: Remove all conditional rendering complexity

### Files Modified (This Session)
```
src/AppRouter.jsx - Removed AnimatePresence, all motion wrappers
src/universe/UniversePage.jsx - Removed title animation
src/universe/components/MapGlobe.jsx - Static stars, no pulse, no rotation
src/universe/components/OrbitalNavigator.jsx - Disabled rotation
src/worlds/chakraCenter/ChakraCenterWorld.jsx - Code-split, removed animations
src/worlds/clubHollywood/ClubHollywoodWorld.jsx - Interval cleanup
src/components/VibePlayer.jsx - Removed console spam
src/worlds/shadowMarket/components/OrderBook.jsx - Fixed interval cleanup
```

### Rollback Plan
If needed, revert to `App.legacy.jsx` structure:
```jsx
// In main.jsx:
import App from "./App.legacy";
<App />
```

---

## 📊 Scale Goals & Architecture

### Primary Zones (Working & Priority)
1. **Kazmo Mansion** - Original world, fully functional
2. **Club Hollywood** - Live music venue with VibePlayer, working

### Secondary Zones (In Development)
3. **Shadow Market** - DeFi/NFT trading (has OrderBook polling)
4. **Chakra Center** - Wellness sanctuary (code-split zones)
5. **Studio Belt** - Recording spaces
6. **Arcane Tower** - Progression hub

### Scaling Strategy
1. **Isolate Working Zones**: Keep Mansion + Club running smoothly
2. **Incremental Addition**: Add ONE zone at a time, test thoroughly
3. **Performance Budget**: 
   - Max 5MB per world bundle
   - Max 3 Sanity queries per world load
   - Zero infinite animations
   - Lazy-load everything
4. **Code-Split Pattern**: 
   - World wrapper (5-10KB)
   - Zones as separate lazy chunks
   - Shared components in vendor bundle

### Current Bundle Sizes (Production)
```
vendor-BQmiA9l8.js                374.72 kB │ gzip: 116.18 kB
vendor_supabase-CD45gUWF.js       158.71 kB │ gzip:  40.68 kB
vendor_framer-motion-BVNjlKgV.js  111.35 kB │ gzip:  36.64 kB
ShadowMarketWorld-CPLsrkCS.js      34.71 kB │ gzip:   9.37 kB
DarkHallway-D9aZrYoV.js            30.45 kB │ gzip:   8.32 kB
KazmoMansionWorld-DyW2B74W.js      10.84 kB │ gzip:   3.26 kB
ClubHollywoodWorld-rxFQqGyX.js      5.65 kB │ gzip:   2.11 kB
ChakraCenterWorld-CJDsemsZ.js       5.51 kB │ gzip:   1.92 kB
```

### Goals for Next Session
- [ ] Confirm Mansion + Club are 100% stable
- [ ] Document exact user flow that triggers glitch
- [ ] Profile browser during glitch (Memory, Performance, Network tabs)
- [ ] Consider removing Chakra/Shadow/Studio/Arcane until root cause found
- [ ] Test on different browsers (Safari, Firefox) to isolate Chrome issues
- [ ] Test with browser extensions disabled

---

**Last Updated**: December 26, 2025  
**Priority**: CRITICAL - Blocking production deployment
