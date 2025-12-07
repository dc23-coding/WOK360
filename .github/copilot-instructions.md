# WOK360 Copilot Instructions

## Project Overview
WOK360 is a visual, immersive React/Vite web experience organized as "rooms" (Dark/Light modes). Each room is a full-viewport section with background imagery, interactive UI overlays, and a story panel system for content navigation.

**Tech Stack:**
- React 18 + Vite 6 with custom plugins
- Tailwind CSS (dark mode via class toggle)
- Radix UI components (dialog, toast, tabs, etc.)
- Framer Motion (animations)
- Custom Vite plugins for visual editing, inline editing, and iframe restoration

## Architecture Patterns

### Room-Based Layout System
Sections are organized as "rooms" with consistent patterns:
- `src/sections/` contains full-viewport sections (Dark/Light variants): `DarkBedroom.jsx`, `LightHallway.jsx`, etc.
- Each room inherits from `RoomSection` wrapper which provides: background image overlay, z-indexed layout, `snap-start` full-height container
- Light/Dark mode branching happens in `App.jsx` state (`mode: "dark" | "light"`), rendering different room chains
- **Example:** `DarkBedroom.jsx` filters `featuredPanels` by `mood !== "light"` and displays night-specific content

### Dual-Mode Component Pattern
Components often accept a `variant` prop to toggle styling:
```jsx
<StoryPanelRail variant="dark" /> // or variant="light"
```
- Dark variant: cyan/blue accents, slate backgrounds (`bg-slate-900/70`, `border-cyan-300`)
- Light variant: amber/orange accents, light backgrounds (`bg-amber-50/80`, `border-amber-200`)
- See `StoryPanelRail.jsx` for complete example

### Positioning via Named Constants
Use top-level component constants for positioning (not magic numbers in JSX):
```jsx
const SCREEN_TOP = "-8%";    // screen position
const SUBTITLE_TOP = "34%";  // subtitle between frame and bed
const RAIL_BOTTOM = "11%";   // panel rail height
```
This enables easy visual tuning without inline style bloat.

## Data Flow

### Featured Panels System
- Central source: `src/panels/data.js` exports `featuredPanels` array
- Each panel has: `id`, `title`, `subtitle`, `mood` ("dark"|"light"), `duration`
- Rooms filter panels by mood: `featuredPanels.filter(p => p.mood !== "light")`
- Active panel state managed locally in each room via `useState`, displayed in the screen overlay

## Build & Development

### Key Scripts
```bash
npm run dev        # Vite dev server on localhost:3000 (--host :: allows network access)
npm run build      # Runs generate-llms.js first (extracts metadata), then Vite build
npm run preview    # Preview production build locally
```

### Custom Vite Plugins
Located in `plugins/`:
- **`vite-plugin-react-inline-editor.js`**: Enables inline editing of text/images in component JSX (used by visual editor)
- **`vite-plugin-edit-mode.js`**: Manages visual editor mode toggle in dev
- **`vite-plugin-selection-mode.js`**: Selection highlighting mode for editing
- **`vite-plugin-iframe-route-restoration.js`**: Restores iframe route state (iframe restoration logic)
- **`visual-editor-config.js`**: Configuration for visual editing features

These plugins parse JSX via Babel AST, validate editability (whitelist tags like `<p>`, `<Button>`, `<h1-h6>`), and inject editing capabilities.

### Build Generation
`tools/generate-llms.js` extracts metadata (routes, titles, descriptions) from components before build—used for SEO/LLM training data. Non-critical (`|| true` in build command means failure is ignored).

## Styling Conventions

### Tailwind Organization
- **Colors:** Primary cyan/blue (dark mode) or amber/orange (light mode)
- **Spacing:** Consistent use of px/py for padding, gap for spacing between elements
- **Effects:** Glow shadows like `shadow-[0_0_48px_rgba(34,211,238,0.6)]` for neon effects
- **Opacity:** Extensive use of `/20`, `/40`, `/70` opacity modifiers for layered aesthetics
- **Responsive:** `md:` breakpoint used extensively (e.g., `w-5 md:w-7`, `text-xs md:text-sm`)

### Tailwind Configuration
- Custom color system via CSS variables in `index.css` (e.g., `--primary`, `--accent`)
- Keyframes defined for accordion animations (base utility set from shadcn-style patterns)
- Extended from standard Tailwind with `tailwindcss-animate` plugin

## Component Structure

### UI Components
`src/components/ui/` contains Radix UI wrapper components:
- `button.jsx`, `dialog.jsx`, `input.jsx`, `label.jsx`, `toast.jsx`, `toaster.jsx`
- These are pre-styled with Tailwind and exported for consistent usage across app

### Main Components
- **`RoomSection.jsx`**: Wrapper for all room sections—provides bg image, overlay, z-indexed layout
- **`StoryPanelRail.jsx`**: Horizontally scrollable list of story panels with variant-based styling
- **`Hero.jsx`, `HeroImage.jsx`**: Landing section components
- **`WelcomeMessage.jsx`, `CallToAction.jsx`**: Static UI blocks
- **`AccessModal.jsx`**: Dialog for access control (Radix UI Dialog-based)

## Development Tips

1. **Add new content:** Update `src/panels/data.js` with new panel objects; rooms will filter and display automatically
2. **Create new room:** Copy `DarkBedroom.jsx` or `LightBedroom.jsx`, adjust background path, positioning constants, and mood filter
3. **Styling changes:** Modify Tailwind classes in-component; use variant props for dark/light divergence
4. **Visual editor:** When running `npm run dev`, inline edit mode is available via plugins (edit-mode-script.js injection)
5. **Responsive design:** Always use `md:` prefixes for larger screens; test both mobile and desktop viewports

## File Organization Quick Reference
- **Sections (full-screen views):** `src/sections/*.jsx`
- **Reusable UI components:** `src/components/*.jsx` + `src/components/ui/`
- **Data/config:** `src/panels/data.js`, `tailwind.config.js`, `vite.config.js`
- **Build tools:** `tools/generate-llms.js`
- **Vite plugins:** `plugins/` (custom transformations and dev features)
