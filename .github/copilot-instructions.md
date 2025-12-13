# WOK360 Copilot Instructions

## Project Overview
**World of Karma 360** is a scalable multi-world immersive platform. The universe contains multiple "worlds" (regions/buildings), with **Kazmo Mansion** as the first active world. Each world is a visual, room-based React/Vite experience with background imagery, interactive UI, and content navigation.

**Tech Stack:**
- React 18 + Vite 6 with custom plugins
- Tailwind CSS (dark mode via class toggle)
- Radix UI components (dialog, toast, tabs, etc.)
- Framer Motion (animations, transitions)
- Supabase (auth, premium gating)
- Custom Vite plugins for visual editing and iframe restoration

## Architecture Patterns

### Universe → Worlds → Rooms Structure
The app follows a three-tier hierarchy:

1. **Universe Level** (`src/universe/`)
   - `UniversePage.jsx`: Main map/selector showing all worlds
   - `MapGlobe.jsx`: Interactive globe view of regions
   - `RegionCard.jsx`: Individual world cards with access control
   - `data/regions.js`: Central registry of all worlds

2. **World Level** (`src/worlds/`)
   - Each world is a self-contained module (e.g., `kazmoMansion/`)
   - World orchestrator (e.g., `KazmoMansionWorld.jsx`) manages state
   - Contains `rooms/`, `hallways/`, and `components/`
   - Lazy-loaded for performance

3. **Room Level** (`src/sections/`)
   - Full-viewport sections with background images
   - Inherited from `RoomSection` wrapper
   - Light/Dark variants for day/night modes
   - Story panels, video players, interactive UI

### Routing Flow
```
AppRouter.jsx (main orchestrator)
  ↓
Front Door (HeroDoor) → Universe Map (UniversePage)
  ↓
Active World (e.g., KazmoMansionWorld)
  ↓
Hallways → Rooms → Modals
```

### Kazmo Mansion (First World)
- **Location**: `src/worlds/kazmoMansion/`
- **Structure**: Re-exports from `src/sections/` (original mansion code)
- **Modes**: Light Wing (day) / Dark Wing (night)
- **Navigation**: Hallways with scroll/modal hybrid system
- **Features**: Story panels, video players, music room, gallery, merch shop

## Data Flow

### Authentication & Access
- Managed by `SupabaseAuthContext` (global)
- Premium status controls dark wing access
- Admin unlock available via keypad
- Per-world access control in `regions.js`

### State Management
```
AppRouter
  ├── hasEnteredUniverse (bool)
  ├── activeWorld (string | null)
  └── isPremium (bool)

KazmoMansionWorld
  ├── mode ("light" | "dark")
  ├── activeRoom (string | null)
  └── isTransitioningMode (bool)
```

### Content Data
- **Universe**: `src/universe/data/regions.js` (world registry)
- **Mansion**: `src/panels/data.js` (story panels, featured content)
- Each panel has: `id`, `title`, `subtitle`, `mood`, `duration`

## Build & Development

### Key Scripts
```bash
npm run dev        # Vite dev server (--host :: for network)
npm run build      # Generates metadata + Vite build
npm run preview    # Preview production build
```

### Custom Vite Plugins
Located in `plugins/`:
- **`vite-plugin-react-inline-editor.js`**: Inline text/image editing
- **`vite-plugin-edit-mode.js`**: Visual editor mode toggle
- **`vite-plugin-selection-mode.js`**: Selection highlighting
- **`vite-plugin-iframe-route-restoration.js`**: Iframe state restoration
- **`visual-editor-config.js`**: Editor configuration

## Styling Conventions

### Tailwind Organization
- **Universe Theme**: Black/slate backgrounds, cyan/amber accents
- **Light Wing**: Amber/orange tones, warm gradients
- **Dark Wing**: Cyan/blue tones, neon effects
- **Spacing**: Consistent `px/py` padding, `gap` for layouts
- **Effects**: Glow shadows (e.g., `shadow-[0_0_48px_rgba(34,211,238,0.6)]`)
- **Opacity**: `/20`, `/40`, `/70` modifiers for layered aesthetics
- **Responsive**: `md:` breakpoint extensively used

### Component Styling
- Dual-mode pattern: `variant="light"` or `variant="dark"` props
- Positioning via named constants (avoid magic numbers)
- Glass-morphism effects (backdrop-blur, semi-transparent backgrounds)

## Component Structure

### Global Components (`src/components/`)
- `RoomSection.jsx`: Wrapper for all room sections (bg, overlay, z-index)
- `StoryPanelRail.jsx`: Horizontal scrollable story panels
- `GlassMenuButton.jsx`: Universal navigation button
- UI components: `button`, `dialog`, `input`, `label`, `toast`, `toaster`

### Universe Components (`src/universe/components/`)
- `MapGlobe.jsx`: Interactive 3D-style globe with region markers
- `RegionCard.jsx`: World preview cards with status badges

### AI Components (`src/ai/cle/`)
- `CleAssistant.jsx`: Universal Ask CLE AI chatbot
- Available globally across all worlds
- Floating orb + expandable modal interface

## Development Tips

### Adding New Worlds
1. Create world module: `src/worlds/yourWorld/YourWorldWorld.jsx`
2. Register in `src/universe/data/regions.js`:
   ```js
   {
     id: "your-world",
     name: "Your World",
     status: "active", // or "coming-soon"
     requiredAccess: "basic", // or "premium"
     entryPoint: "/world/your-world"
   }
   ```
3. Add to `AppRouter.jsx`:
   ```jsx
   const YourWorld = lazy(() => import("./worlds/yourWorld/YourWorldWorld"));
   {activeWorld === "your-world" && <YourWorld ... />}
   ```

### Adding New Rooms to Kazmo Mansion
1. Create room component in `src/sections/`
2. Add re-export in `src/worlds/kazmoMansion/rooms/`
3. Update hallway navigation with modal trigger
4. Add to `KazmoMansionWorld.jsx` modal renderer

### Styling Changes
- Modify Tailwind classes in-component
- Use `variant` props for light/dark divergence
- Test both mobile (`w-full`) and desktop (`md:` prefixes)

### Visual Editor
- Inline edit mode available via plugins in dev mode
- Edit text/images directly in JSX
- Whitelist tags: `<p>`, `<Button>`, `<h1-h6>`

## File Organization Quick Reference

### Core Architecture
- **Main Router**: `src/AppRouter.jsx`
- **Universe**: `src/universe/` (map, globe, region cards)
- **Worlds**: `src/worlds/` (kazmoMansion, future worlds)
- **Global AI**: `src/ai/cle/` (CLE assistant)
- **Legacy**: `src/App.legacy.jsx` (backup of original app)

### Kazmo Mansion
- **Wrapper**: `src/worlds/kazmoMansion/KazmoMansionWorld.jsx`
- **Rooms**: `src/sections/*.jsx` (original mansion code)
- **Re-exports**: `src/worlds/kazmoMansion/rooms/` & `hallways/`

### Shared Resources
- **Components**: `src/components/` (UI, sections, utilities)
- **Context**: `src/context/` (auth, state providers)
- **Data**: `src/panels/data.js`, `src/universe/data/regions.js`
- **Config**: `tailwind.config.js`, `vite.config.js`
- **Tools**: `tools/generate-llms.js` (metadata extraction)

## Migration Notes

### Recent Changes (Dec 2025)
- Restructured from single-world to multi-world architecture
- `App.jsx` → `AppRouter.jsx` (old version preserved as `App.legacy.jsx`)
- Added universe layer above Kazmo Mansion
- Moved CLE AI to global `src/ai/cle/`
- Mansion code unchanged in `src/sections/` (re-exported by world module)

### Key Differences
- **Before**: App → Mansion (direct)
- **After**: AppRouter → Universe → World → Rooms
- **Benefits**: Scalable, performance-optimized, game-like navigation

### Rollback
To revert to original structure:
```jsx
// In main.jsx:
import App from "./App.legacy";
<App />
```

## Performance

### Lazy Loading
- All worlds lazy-loaded (only active world renders)
- Rooms within worlds lazy-loaded
- Suspense fallbacks for smooth loading states

### Code Splitting
- Automatic via Vite
- Per-world bundles
- Shared chunks for common components

### Asset Management
- Background images per world/room
- CDN-ready structure
- Optimized for scalability

## Future Expansion

### Planned Worlds
1. **Studio Belt** - Recording & production spaces
2. **Garden Ring** - Meditation & ambient content
3. **Shadow Market** - Exclusive merch & NFTs
4. **Arcane Tower** - CLE AI hub & knowledge library

### Advanced Features Roadmap
- 2D/3D world rendering (Three.js)
- Character avatars & movement
- Multiplayer zones
- Live events & streams
- Achievement/progression system
- Cross-world memory & unlocks

## Documentation

- **Architecture**: See `ARCHITECTURE.md` for full technical details
- **Migration**: See `MIGRATION.md` for restructure changelog
- **Copilot**: This file (`copilot-instructions.md`)

## Summary

**World of Karma 360** is now a universe-scale platform where Kazmo Mansion is the first active world. The architecture supports infinite expansion while maintaining clean separation, optimal performance, and a unified brand experience. All original mansion features remain intact—now wrapped in a scalable, game-like navigation system.
