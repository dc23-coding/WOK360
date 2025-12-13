# World of Karma 360 - Architecture Documentation

## 🌌 Universe Structure

World of Karma 360 is now organized as a **scalable multi-world platform** with the following architecture:

```
World of Karma Universe
  └── Kazmo District
      └── Kazmo Mansion (ACTIVE)
  └── Creative Quarter
      └── Studio Belt (Coming Soon)
  └── Serenity Zone
      └── Garden Ring (Coming Soon)
  └── Exchange District
      └── Shadow Market (Coming Soon)
  └── AI Nexus
      └── Arcane Tower (Coming Soon)
```

---

## 📁 Project Structure

```
src/
├── AppRouter.jsx              # Main router: Universe → Worlds
├── App.legacy.jsx             # Original app (backup)
│
├── universe/                  # Universe-level components
│   ├── UniversePage.jsx       # Main universe map/selector
│   ├── components/
│   │   ├── MapGlobe.jsx       # Interactive globe view
│   │   └── RegionCard.jsx     # World/region cards
│   └── data/
│       └── regions.js         # Universe registry (all worlds)
│
├── worlds/                    # World modules
│   └── kazmoMansion/          # Kazmo Mansion (first world)
│       ├── KazmoMansionWorld.jsx  # Mansion orchestrator
│       ├── hallways/          # Re-exports from sections/
│       ├── rooms/             # Re-exports from sections/
│       └── components/        # Mansion-specific components
│
├── ai/                        # Global AI services
│   └── cle/                   # Ask CLE AI Assistant
│       ├── CleAssistant.jsx   # Universal CLE component
│       └── index.js           # Barrel export
│
├── sections/                  # Original mansion sections (unchanged)
│   ├── HeroDoor.jsx
│   ├── LightHallway.jsx
│   ├── DarkHallway.jsx
│   ├── LightBedroom.jsx
│   └── ... (all existing rooms)
│
├── components/                # Shared UI components
├── context/                   # Auth & state providers
├── panels/                    # Content data
└── lib/                       # Utilities
```

---

## 🎮 How It Works

### 1. Entry Flow

```
Front Door (HeroDoor)
  ↓ (user enters)
Universe Map (UniversePage)
  ↓ (click world)
Active World (e.g., KazmoMansionWorld)
  ↓ (explore rooms)
Exit back to Universe Map
```

### 2. Routing Levels

- **AppRouter.jsx**: Top-level orchestrator
  - Manages: door → universe → active world
  - State: `hasEnteredUniverse`, `activeWorld`

- **UniversePage.jsx**: World selector
  - Shows grid/globe view of all regions
  - Filters by access (basic/premium)

- **KazmoMansionWorld.jsx**: Mansion orchestrator
  - Manages: hallways → rooms → light/dark wings
  - State: `mode`, `activeRoom`

### 3. World Modules

Each world is self-contained:
- Own hallways and rooms
- Own components and assets
- Own routing and state
- Lazy-loaded for performance

---

## 🔧 Adding New Worlds

### Step 1: Create World Module

```
src/worlds/studioBelt/
  ├── StudioBeltWorld.jsx
  ├── rooms/
  ├── hallways/
  └── components/
```

### Step 2: Register in Universe

Add to `src/universe/data/regions.js`:

```js
{
  id: "studio-belt",
  name: "Studio Belt",
  district: "Creative Quarter",
  status: "active",  // or "coming-soon"
  requiredAccess: "premium",  // or "basic"
  entryPoint: "/world/studio-belt",
  // ... other metadata
}
```

### Step 3: Add to AppRouter

Import and add conditional render:

```jsx
const StudioBeltWorld = lazy(() => import("./worlds/studioBelt/StudioBeltWorld"));

// In render:
{activeWorld === "studio-belt" && (
  <StudioBeltWorld
    isPremium={isPremium}
    onExitWorld={handleExitWorld}
  />
)}
```

---

## 🌟 Key Features

### Multi-World Support
- Infinite scalability
- Independent world state
- Lazy loading for performance
- Shared authentication

### Universal CLE AI
- Available in all worlds
- Contextual assistance
- Memory across worlds
- Located in `src/ai/cle/`

### Premium Gating
- Per-world access control
- Defined in `regions.js`
- Consistent across universe

### Smooth Transitions
- Door animations between wings
- Fade transitions between worlds
- Exit to universe map from any world

---

## 🎨 Theming

### Global Theme
- Black/slate background
- Cyan/amber accents
- Consistent across universe

### World-Specific Themes
- Each world can override
- Maintain brand consistency
- Use shared components

---

## 📊 Data Flow

### Authentication (Supabase)
```
SupabaseAuthContext (global)
  ↓
AppRouter (user, isPremium)
  ↓
UniversePage / Worlds (access control)
```

### World State
```
AppRouter
  ↓ activeWorld
KazmoMansionWorld
  ↓ mode, activeRoom
Individual Rooms
```

### Content Data
```
src/panels/data.js (mansion content)
src/universe/data/regions.js (universe registry)
```

---

## 🚀 Performance

### Lazy Loading
- All worlds lazy-loaded
- Rooms within worlds lazy-loaded
- Only load what's needed

### Code Splitting
- Automatic via Vite
- Per-world bundles
- Shared chunks for common code

### Asset Management
- Background images per world
- Shared UI components
- CDN-ready structure

---

## 🔮 Future Expansion

### Planned Worlds
1. **Studio Belt** - Production & recording spaces
2. **Garden Ring** - Meditation & ambient content
3. **Shadow Market** - Exclusive merch & NFTs
4. **Arcane Tower** - CLE AI hub & knowledge library

### Advanced Features
- 2D/3D world rendering (Three.js)
- Character avatars & movement
- Multiplayer zones
- Live events & streams
- Achievement system
- Cross-world progression

---

## 🛠 Migration Notes

### What Changed
- `App.jsx` → `AppRouter.jsx` (renamed old to `.legacy.jsx`)
- Added universe layer above mansion
- Moved CLE to global `src/ai/cle/`
- Mansion now in `src/worlds/kazmoMansion/`
- Added world routing system

### What Stayed the Same
- All existing mansion sections unchanged
- All components work as before
- Authentication system unchanged
- UI styling consistent
- No breaking changes to existing functionality

### Backward Compatibility
- `App.legacy.jsx` preserved as backup
- All original sections in `src/sections/` untouched
- Can revert by changing `main.jsx` import

---

## 📝 Quick Start

### Run the app:
```bash
npm run dev
```

### Access flow:
1. Enter through front door
2. View universe map (grid or globe)
3. Click "Kazmo Mansion" to enter
4. Explore light/dark wings as before
5. Click "← Universe Map" to exit

### Add a world:
1. Create module in `src/worlds/yourWorld/`
2. Register in `regions.js`
3. Add to `AppRouter.jsx`
4. Set status to `"active"`

---

## 🎯 Summary

**Before**: Single mansion app with light/dark wings

**After**: Scalable universe platform where Kazmo Mansion is World #1

**Benefits**:
- ✅ Infinite expansion capacity
- ✅ Clean separation of concerns
- ✅ Performance optimized
- ✅ Game-like navigation
- ✅ Unified brand experience
- ✅ Ready for 3D/multiplayer
- ✅ One codebase, one deploy

**World of Karma 360 is now a true metaverse platform.** 🌍✨
