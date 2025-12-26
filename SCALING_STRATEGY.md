# WOK360 - Goals & Scaling Strategy

## 🎯 Core Mission
Build a scalable multi-world immersive platform where each "world" is a self-contained experience with its own authentication, content, and interactions.

## 🏗️ Architecture Principles

### 1. World Isolation
- Each world is a **lazy-loaded module** with zero dependencies on other worlds
- Authentication at world entry (ZoneKeypad) - no global auth gate
- Content managed via Sanity CMS with `zone` and `room` targeting
- Worlds communicate only through:
  - Global MediaPlayer (audio/video persistence)
  - CLE AI Assistant (universal chatbot)
  - ZoneContext (shared state for auth/mode)

### 2. Performance Budget (Per World)
```
Max Bundle Size:   10KB gzipped (world wrapper)
Max Image Size:    500KB per background (WebP)
Max Sanity Queries: 3 on initial load
Zero Infinite Animations: All motion must be user-triggered
Lazy Load Everything: Rooms, zones, components
```

### 3. Code-Split Pattern
```
worlds/
  worldName/
    WorldNameWorld.jsx     (5-10KB - orchestrator)
    zones/                 (lazy-loaded sub-experiences)
      Zone1.jsx
      Zone2.jsx
    components/            (world-specific only)
      Component1.jsx
    data/                  (static data, no runtime imports)
      content.js
```

## 🌍 World Status & Priorities

### ✅ Tier 1: Production-Ready (FOCUS)
1. **Kazmo Mansion** - Original world, fully functional
   - Light Wing + Dark Wing (day/night modes)
   - Story panels, video players, merch shop
   - Hallway navigation system
   - **Status**: Stable, demo-ready

2. **Club Hollywood** - Live music venue
   - VibePlayer with Sanity content integration
   - Audience presence indicators
   - Reaction system (emoji drops)
   - **Status**: Stable, demo-ready

### ⚠️ Tier 2: In Development (PAUSED)
3. **Shadow Market** - DeFi/NFT trading
   - Coinbase API integration for live prices
   - OrderBook with 3s polling
   - Wallet connection (Phantom/Solflare)
   - **Issue**: OrderBook polling may cause memory leak

4. **Chakra Center** - Wellness sanctuary
   - 3 zones: Wellness Library, Health Tracker, AI Advisor
   - Code-split zones (lazy-loaded)
   - **Issue**: Crashes on entry (useState → useEffect bug fixed, but glitch persists)

5. **Studio Belt** - Recording spaces
   - **Status**: Basic structure, needs content

6. **Arcane Tower** - Progression hub
   - Achievements, analytics, rewards
   - **Status**: Placeholder gradient background

### 🚫 Tier 3: Future (NOT STARTED)
- **Garden Ring** - Meditation & ambient content
- **Multiverse Studio** - 3D world rendering
- **Live Events** - Streaming integration

## 📋 Scaling Roadmap

### Phase 1: Stabilize Core (CURRENT)
**Goal**: Mansion + Club Hollywood running flawlessly
- [x] Image optimization (98% reduction)
- [x] Remove all infinite animations
- [x] Code-split heavy worlds
- [ ] **Profile and fix browser glitch**
- [ ] **Remove unstable zones temporarily**
- [ ] Deploy to production (Vercel)
- [ ] Demo with 2 working worlds

### Phase 2: Add Worlds Incrementally
**Goal**: One world at a time, full testing
1. Re-enable **Shadow Market** after profiling
   - Test OrderBook polling impact
   - Consider websocket instead of polling
   - Verify no memory leaks

2. Re-enable **Chakra Center** after fix
   - Test zone transitions thoroughly
   - Ensure lazy loading works correctly
   - Profile memory usage

3. Build out **Studio Belt**
   - Add recording room content
   - Integrate audio player
   - Test with Club Hollywood running

4. Complete **Arcane Tower**
   - Implement progression system
   - Add achievement tracking
   - Integrate with other worlds

### Phase 3: Advanced Features
- 2D/3D world rendering (Three.js)
- Live streaming integration
- Multiplayer presence system
- NFT/blockchain integration
- Mobile app (React Native)

## 🛠️ Development Workflow

### Adding a New World
```bash
1. Create world module:
   src/worlds/newWorld/NewWorldWorld.jsx

2. Register in regions.js:
   { id: "new-world", name: "New World", status: "active" }

3. Add to AppRouter.jsx:
   const NewWorld = lazy(() => import("./worlds/newWorld/NewWorldWorld"));
   {activeWorld === "new-world" && <Suspense><NewWorld /></Suspense>}

4. Test in isolation before enabling universe access
```

### Performance Testing Checklist
- [ ] Chrome DevTools → Performance tab (record 30s of interaction)
- [ ] Memory tab (watch for leaks over 5 min)
- [ ] Network tab (ensure images cached, no repeated queries)
- [ ] Lighthouse score (aim for 90+ performance)
- [ ] Test on mobile device (touch interactions)
- [ ] Test with browser extensions disabled

## 📊 Success Metrics

### Per World
- Load time: <2s on 3G
- Bundle size: <10KB gzipped
- Memory usage: Stable over 10 min
- Frame rate: 60fps during interactions
- Lighthouse: 90+ performance score

### Universe
- Total page weight: <5MB (with all images)
- World switching: <500ms
- Concurrent worlds: Only 1 active at a time
- Zero memory leaks
- Zero console errors

## 🔄 Rollback Strategy

If universe structure causes issues, revert to single-world:
```jsx
// main.jsx
import App from "./App.legacy"; // Original Kazmo Mansion only
<App />
```

**Backup**: `App.legacy.jsx` contains fully functional original mansion before universe migration.

## 💡 Key Learnings

1. **Framer Motion is expensive**: Even simple animations (opacity, scale) compound across components
2. **Images dominate**: 40MB of PNGs → 1MB WebP = 98% savings
3. **Polling intervals leak**: Always cleanup with `return () => clearInterval(id)`
4. **React Suspense boundaries**: Can cause race conditions if state changes during load
5. **Browser glitches**: Sometimes caused by CSS transforms, not JS

## 🎓 Resources

- **Architecture**: `ARCHITECTURE.md`
- **Migration**: `MIGRATION.md`
- **Known Issues**: `KNOWN_ISSUES.md`
- **Copilot Instructions**: `.github/copilot-instructions.md`

---

**Last Updated**: December 26, 2025  
**Next Review**: After stabilizing Mansion + Club Hollywood
